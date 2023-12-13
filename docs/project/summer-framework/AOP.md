---
title: AOP
order: 2
author: zzys
date: 2023-12-09
category:
- 项目
tag:
- spring
- AOP
---

本文为廖雪峰老师的[手写Spring](https://www.liaoxuefeng.com/wiki/1539348902182944)笔记中的AOP一节，仅作个人学习使用。

## 创建AOP代理实例

在这里使用ByteBuddy字节码技术来动态生成代理。我们在这里写的代码很简单，复杂的工作都被框架底层完成了。

我们创建ProxyResolver类，其中createProxy方法用于对传入的Bean创建代理实例，其中的增强逻辑是传入的第二个参数InvocationHandler。

```java
public <T> T createProxy(T bean, InvocationHandler handler) {
    Class<?> targetClass = bean.getClass();
    Class<?> proxyClass = this.byteBuddy
        .subclass(targetClass, ConstructorStrategy.Default.DEFAULT_CONSTRUCTOR)
        .method(ElementMatchers.isPublic()).intercept(InvocationHandlerAdapter.of(
        new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                return handler.invoke(bean, method, args);
            }
        }))
        .make().load(targetClass.getClassLoader()).getLoaded();
    Object proxy;
    try {
        proxy = proxyClass.getConstructor().newInstance();
    } catch (RuntimeException e) {
        throw e;
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
    return (T) proxy;
}
```

## 实现AOP

实现AOP需要提供以下的Bean：

- BeanPostProcessor：用于对符合条件（指定注解）的Bean为其生成代理，增强逻辑。
- InvocationHandler：指定增强的逻辑代码。

`AnnotationProxyBeanPostProcessor`是一个抽象类，它实现了`BeanPostProcessor`接口，同时提供了一个泛型，指定必须是注解类型，它抽象出来了一层关于实现AOP BeanPostProcessor的模板方法。

我们首先看它的构造方法中，实际上是获取到了运行时的实际泛型参数，实际上也就是我们指定的注解。

之后在`postProcessBeforeInitialization`中，如果当前Bean上有我们当前BeanPostProcessor指定的注解，那么就为其生成代理类并替换它的实例。

`InvocationHandler`是通过指定Bean的Value获取到的，所以这个字段是必填的。

同时我们也需要记录原始的实例。

```java
public abstract class AnnotationProxyBeanPostProcessor<A extends Annotation> implements BeanPostProcessor {

    Map<String, Object> originBeans = new HashMap<>();
    Class<A> annotationClass;

    public AnnotationProxyBeanPostProcessor() {
        this.annotationClass = getParameterizedType();
    }

    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        Class<?> beanClass = bean.getClass();

        // has class-level @Annotation?
        A anno = beanClass.getAnnotation(annotationClass);
        if (anno != null) {
            String handlerName;
            try {
                handlerName = (String) anno.annotationType().getMethod("value").invoke(anno);
            } catch (ReflectiveOperationException e) {
                throw new AopConfigException();
            }
            Object proxy = createProxy(beanClass, bean, handlerName);
            originBeans.put(beanName, bean);
            return proxy;
        } else {
            return bean;
        }
    }

    Object createProxy(Class<?> beanClass, Object bean, String handlerName) {
        ConfigurableApplicationContext ctx = (ConfigurableApplicationContext) ApplicationContextUtils.getRequiredApplicationContext();

        BeanDefinition def = ctx.findBeanDefinition(handlerName);
        if (def == null) {
            throw new AopConfigException();
        }
        Object handlerBean = def.getInstance();
        if (handlerBean == null) {
            handlerBean = ctx.createBeanAsEarlySingleton(def);
        }
        if (handlerBean instanceof InvocationHandler handler) {
            return ProxyResolver.getInstance().createProxy(bean, handler);
        } else {
            throw new AopConfigException();
        }
    }

    @Override
    public Object postProcessOnSetProperty(Object bean, String beanName) {
        Object origin = this.originBeans.get(beanName);
        return origin != null ? origin : bean;
    }

    @SuppressWarnings("unchecked")
    private Class<A> getParameterizedType() {
        Type type = getClass().getGenericSuperclass();
        if (!(type instanceof ParameterizedType)) {
            throw new IllegalArgumentException();
        }
        ParameterizedType pt = (ParameterizedType) type;
        Type[] types = pt.getActualTypeArguments();
        if (types.length != 1) {
            throw new IllegalArgumentException();
        }
        Type r = types[0];
        if (!(r instanceof Class<?>)) {
            throw new IllegalArgumentException();
        }
        return (Class<A>) r;
    }
}
```

## 使用

举一个使用的例子，假设需要提供打印日志的功能，那么我们需要以下的类

- @Log
- LogInvocationHandler
- LogBeanPostProcessor

具体使用如下：

首先创建一个自定义注解，可以标注在类和方法上。标注在类上说明这个类需要被代理，标注在方法上用于过滤方法。

```java
@Target({ElementType.METHOD,ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {

    /**
     * Invocation handler bean name.
     */
    String value();
}
```

声明一个LogProxyBeanPostProcessor的Bean，注入IOC中，具体的逻辑由AnnotationProxyBeanPostProcessor实现。

```java
@Component
public class LogProxyBeanPostProcessor extends AnnotationProxyBeanPostProcessor<Log> {
}
```

实现我们的自定义增强逻辑，首先筛选出带有@Log的方法，然后增强。

```java
@Component
public class LogInvocationHandler implements InvocationHandler {

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 可以在Method上也加入@Log，只拦截标记了@Log的方法:
        if (method.getAnnotation(Log.class) != null) {
            System.out.println("init");
            String ret = (String) method.invoke(proxy, args);
            System.out.println("out");
            return ret;
        }
        return method.invoke(proxy, args);
    }
}
```

具体的业务类：

```java
@Component
@Log("LogInvocationHandler")
public class Service {
    @Log
    public String hello() {
        return "Hello, " + name + ".";
    }
}
```

