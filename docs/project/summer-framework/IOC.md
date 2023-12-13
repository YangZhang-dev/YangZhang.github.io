---
title: IOC
order: 1
author: zzys
date: 2023-12-08
category:
- 项目
tag:
- spring
- IOC
---

本文为廖雪峰老师的[手写Spring](https://www.liaoxuefeng.com/wiki/1539348902182944)笔记中的IOC一节，仅作个人学习使用。

本文创建的IOC是SpringIOC的缩减版：

- 不支持别名，Bean的名称全局唯一
- 没有父子容器的层级
- 只支持注解扫描
- 仅支持单例Bean

## ResourceResolver

IOC在本质就是一个大Map，存放我们需要的Bean。所以我们通过XML或注解的形式声明需要交给spring管理的类，那么资源处理就是我们最先需要考虑的事情。

首先定义`Resource`代表资源（一般是class文件），下面是它的定义：

```java
public record Resource(String path, String name) {
}
```

`record`是在JDK16中引入的关键字，由recode修饰的类称为档案类，意味着不可变，将上面的代码转换到JDK1.8如下：

```java
public final class Resource{

    public final String path;
    public final String name;
    public Resource(String path, String name) {
        this.path = path;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Resource{" +
                "path='" + path + '\'' +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Resource resource = (Resource) o;
        return Objects.equals(path, resource.path) &&
                Objects.equals(name, resource.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(path, name);
    }
}
```

下面，我们来定义资源处理器`ResourceResolver`，向外提供一个scan方法，参数是一个Function接口，用于外部自定义匹配文件方式。比如只要.class文件，或者只要.txt文件。

在创建ResourceResolver时，需要传入一个basePackage，指定扫描的包路径。

核心代码：

```java
public <R> List<R> scan(Function<Resource, R> mapper) {
    String basePackagePath = this.basePackage.replace(".", "/");
    String path = basePackagePath;
    try {
        List<R> collector = new ArrayList<>();
        scan0(basePackagePath, path, collector, mapper);
        return collector;
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    } catch (URISyntaxException e) {
        throw new RuntimeException(e);
    }
}
<R> void scan0(String basePackagePath, String path, List<R> collector, Function<Resource, R> mapper) throws IOException, URISyntaxException {
    logger.atDebug().log("scan path: {}", path);
    Enumeration<URL> en = ClassPathUtils.getContextClassLoader().getResources(path);
    while (en.hasMoreElements()) {
        URL url = en.nextElement();
        URI uri = url.toURI();
        String uriStr = removeTrailingSlash(uriToString(uri));
        String uriBaseStr = uriStr.substring(0, uriStr.length() - basePackagePath.length());
        if (uriBaseStr.startsWith("file:")) {
            uriBaseStr = uriBaseStr.substring(5);
        }
        if (uriStr.startsWith("jar:")) {
            scanFile(true, uriBaseStr, jarUriToPath(basePackagePath, uri), collector, mapper);
        } else {
            scanFile(false, uriBaseStr, Paths.get(uri), collector, mapper);
        }
    }
}
<R> void scanFile(boolean isJar, String base, Path root, List<R> collector, Function<Resource, R> mapper) throws IOException {
    String baseDir = removeTrailingSlash(base);
    Files.walk(root).filter(Files::isRegularFile).forEach(file -> {
        Resource res = null;
        if (isJar) {
            res = new Resource(baseDir, removeLeadingSlash(file.toString()));
        } else {
            String path = file.toString();
            String name = removeLeadingSlash(path.substring(baseDir.length()));
            res = new Resource("file:" + path, name);
        }
        logger.atDebug().log("found resource: {}", res);
        R r = mapper.apply(res);
        if (r != null) {
            collector.add(r);
        }
    });
}
```

## PropertyResolver

这一章节完成依赖注入中的**配置注入**，对应

1. 按配置的key查询，例如：`getProperty("app.title")`;
2. 以`${abc.xyz}`形式的查询，例如，`getProperty("${app.title}")`，常用于`@Value("${app.title}")`注入；
3. 带默认值的，以`${abc.xyz:defaultValue}`形式的查询，例如，`getProperty("${app.title:Summer}")`，常用于`@Value("${app.title:Summer}")`注入。

我们使用k-v结构将所有的配置项保存在Map中，借助Java中的Properties传入，在存到我们的Map中。这样我们发现，所有的kv都是String，但是很明显我们需要在取出配置时，注入正确的类型，所以在这里引入一个`Map<Class<?>, Function<String, Object>>`的convert转换器，我们在内部初始化好一些常用的转换，其他的可以开放一个注册接口，客户端可以注册自己的转换类型。

核心代码如下：

```java
public PropertyResolver(Properties props) {
    // 存入系统环境变量
    this.properties.putAll(System.getenv());
    // 存入传进来的配置项
    Set<String> names = props.stringPropertyNames();
    for (String name : names) {
        this.properties.put(name, props.getProperty(name));
    }
    // register converters:
    converters.put(String.class, s -> s);
    converters.put(boolean.class, Boolean::parseBoolean);
    converters.put(Boolean.class, Boolean::valueOf);
	// ...
}
public void registerConverter(Class<?> targetType, Function<String, Object> converter) {
    this.converters.putIfAbsent(targetType, converter);
}
public <T> T getProperty(String key, Class<T> targetType, T defaultValue) {
    String value = getProperty(key);
    if (value == null) {
        return defaultValue;
    }
    return convert(targetType, value);
}
```

至于`${}`语法的匹配，不去理解太多，具体的就是字串匹配。

额外还可以实现Yaml的导入：

```java
public static Map<String, Object> loadYaml(String path) {
    var loaderOptions = new LoaderOptions();
    var dumperOptions = new DumperOptions();
    var representer = new Representer(dumperOptions);
    var resolver = new NoImplicitResolver();
    var yaml = new Yaml(new Constructor(loaderOptions), representer, dumperOptions, loaderOptions, resolver);
    // 挂载钩子，当读取到InputStream后，自动加载到Yaml对象中
    return ClassPathUtils.readInputStream(path, yaml::load);
}

@FunctionalInterface
public interface InputStreamCallback<T> {

    T doWithInputStream(InputStream stream) throws IOException;
}
```

整体的使用如下：

```java
Map<String, Object> configs = YamlUtils.loadYamlAsPlainMap("/application.yml");
Properties properties = new Properties();
properties.putAll(configs);
PropertyResolver propertyResolver = new PropertyResolver(properties);
assertEquals("Summer Framework", propertyResolver.getProperty("app.title"));
```

## BeanDefinition

现在我们已经完成了实现IOC的前提条件：ResourceResolver扫描Class，PropertyResolver获取配置。下面就开始真正的创建IOC容器。

首先需要创建`BeanDefinition`对象，用于描述需要创建的Bean的详细信息，同时也方便我们做扩展点，这里一个Bean只允许有一个名字。

```java
// 全局唯一名称
private final String name;
// Bean的声明类型
private final Class<?> beanClass;
// Bean的实例
private Object instance = null;
// 构造方法
private final Constructor<?> constructor;
// 工厂方法名称
private final String factoryName;
// 工厂方法
private final Method factoryMethod;
// 用于在获取List<BeanDefinition>时的排序
private final int order;
// 在获取BeanDefinition时如果只有一个Bean含有Primary，则返回它
private final boolean primary;

// 是否立即注入（非懒加载）
private boolean init = false;

// @Bean(initMethod="init", destroyMethod="destroy")
private String initMethodName;
private String destroyMethodName;

// @PostConstruct and @PreDestroy:
private Method initMethod;
private Method destroyMethod;
```

注入Bean可以分为两种形式：

- @Component：整个类是一个Bean，其中可以定义`@PostConstruct`和`@PreDestroy`生命周期方法。
- @Configuration+@Bean：首先整个类是一个Bean，其次它可以看作一个工厂，其中的@Bean可以看作工厂方法，每个返回的类也是一个Bean，其中可以指定生命周期方法`@Bean(initMethod="init",destroyMethod="destroy")`。

对于BeanDefinition中的`private final Class<?> beanClass`，它仅仅是声明类型，不一定是运行时类型，在@Bean中可能返回它的子类。而使用`instance.getClass()`获取的才是它真正的运行时类型。

那么，在通过一个类型获取一个Bean时，就需要额外判断，因为它不像名称是全局唯一的，有可能定义了多个不同类型的Bean，声明类型却是相同的。这时就需要@Primary注解，如果@Primary不唯一或没有，就需要抛出异常。

## CreateBeanDefinition

创建一个`AnnotationConfigApplicationContext`类型作为IOC容器：

```java
protected final PropertyResolver propertyResolver;
protected final Map<String, BeanDefinition> beans;

public AnnotationConfigApplicationContext(Class<?> configClass, PropertyResolver propertyResolver) {
    this.propertyResolver = propertyResolver;

    // 扫描获取所有Bean的Class类型:
    final Set<String> beanClassNames = scanForClassNames(configClass);

    // 创建Bean的定义:
    this.beans = createBeanDefinitions(beanClassNames);
}
```

- 通过传入的配置类递归查找`@ComponentScan`注解，递归的意思是可能`@ComponentScan`在当前无关注解的上面。如果不存在或值为空就使用传入的类作为扫描包路径
- 扫描包和子孙包，使用我们的ResourceResolver扫描class文件。
- 扫描配置类上是否有`@Import`注解，将其中的类加入我们的资源Set中。

```java
protected Set<String> scanForClassNames(Class<?> configClass) {
    // 递归获取要扫描的package名称:
    ComponentScan scan = ClassUtils.findAnnotation(configClass, ComponentScan.class);
    final String[] scanPackages = scan == null || scan.value().length == 0 ? new String[] { configClass.getPackage().getName() } : scan.value();

    Set<String> classNameSet = new HashSet<>();
    for (String pkg : scanPackages) {
        // 扫描package:
        var rr = new ResourceResolver(pkg);
        List<String> classList = rr.scan(res -> {
            String name = res.name;
            if (name.endsWith(".class")) {
                return name.substring(0, name.length() - 6).replace("/", ".").replace("\\", ".");
            }
            return null;
        });
        classNameSet.addAll(classList);
    }

    // 查找@Import(Xyz.class):
    Import importConfig = configClass.getAnnotation(Import.class);
    if (importConfig != null) {
        for (Class<?> importConfigClass : importConfig.value()) {
            String importClassName = importConfigClass.getName();
            if (!classNameSet.contains(importClassName)) {
                classNameSet.add(importClassName);
            }
        }
    }
    return classNameSet;
}
```

- 根据资源Set，创建Class对象，判断是否是类对象。
- 判断是否是抽象类或者私有类
- 递归判断类上是否存在`@Component`注解（`@Configuration`注解上有`@Component`注解）
  - 如果有`@Component`注解，那么为其创建`BeanDefinition`，注意这里的工厂名和工厂方法为空，`initMethodName`和`destroyMethodName`也为空。
  - 同时看它是否有`@Configuration`注解，如果有就去扫描它的方法。
-  注意这里的BeanName是先去看在`@Component`中是否配置了名称，如果没有就使用类名的小写。

```java
Map<String, BeanDefinition> createBeanDefinitions(Set<String> classNameSet) {
    Map<String, BeanDefinition> defs = new HashMap<>();
    for (String className : classNameSet) {
        // 获取Class:
        Class<?> clazz = null;
        try {
            clazz = Class.forName(className);
        } catch (ClassNotFoundException e) {
            throw new BeanCreationException(e);
        }
        if (clazz.isAnnotation() || clazz.isEnum() || clazz.isInterface() || clazz.isRecord()) {
            continue;
        }
        int mod = clazz.getModifiers();
        if (Modifier.isAbstract(mod)) {
            throw new BeanDefinitionException("@Component class " + clazz.getName() + " must not be abstract.");
        }
        if (Modifier.isPrivate(mod)) {
            throw new BeanDefinitionException("@Component class " + clazz.getName() + " must not be private.");
        }
        // 是否标注@Component?
        Component component = ClassUtils.findAnnotation(clazz, Component.class);
        if (component != null) {
            logger.atDebug().log("found component: {}", clazz.getName());
            String beanName = ClassUtils.getBeanName(clazz);
            var def = new BeanDefinition(beanName, clazz, getSuitableConstructor(clazz), getOrder(clazz), clazz.isAnnotationPresent(Primary.class),
                                         // named init / destroy method:
                                         null, null,
                                         // init method:
                                         ClassUtils.findAnnotationMethod(clazz, PostConstruct.class),
                                         // destroy method:
                                         ClassUtils.findAnnotationMethod(clazz, PreDestroy.class));
            addBeanDefinitions(defs, def);

            Configuration configuration = ClassUtils.findAnnotation(clazz, Configuration.class);
            if (configuration != null) {
                scanFactoryMethods(beanName, clazz, defs);
            }
        }
    }
    return defs;
}
```

- 获取到所有声明的方法，查看是否有@Bean修饰。
- 检查方法的修饰符（final，abstract，private）。
- 检查返回类型（简单类型，Void类型）。
- 创建`BeanDefinition`，注意这里的工厂名和工厂方法不为空，`initMethod`和`destroyMethod`也为空。

```java
void scanFactoryMethods(String factoryBeanName, Class<?> clazz, Map<String, BeanDefinition> defs) {
    for (Method method : clazz.getDeclaredMethods()) {
        Bean bean = method.getAnnotation(Bean.class);
        if (bean != null) {
            int mod = method.getModifiers();
            if (Modifier.isAbstract(mod)) {
                throw new BeanDefinitionException("@Bean method " + clazz.getName() + "." + method.getName() + " must not be abstract.");
            }
            if (Modifier.isFinal(mod)) {
                throw new BeanDefinitionException("@Bean method " + clazz.getName() + "." + method.getName() + " must not be final.");
            }
            if (Modifier.isPrivate(mod)) {
                throw new BeanDefinitionException("@Bean method " + clazz.getName() + "." + method.getName() + " must not be private.");
            }
            Class<?> beanClass = method.getReturnType();
            if (beanClass.isPrimitive()) {
                throw new BeanDefinitionException("@Bean method " + clazz.getName() + "." + method.getName() + " must not return primitive type.");
            }
            if (beanClass == void.class || beanClass == Void.class) {
                throw new BeanDefinitionException("@Bean method " + clazz.getName() + "." + method.getName() + " must not return void.");
            }
            var def = new BeanDefinition(ClassUtils.getBeanName(method), beanClass, factoryBeanName, method, getOrder(method),
                                         method.isAnnotationPresent(Primary.class),
                                         // init method:
                                         bean.initMethod().isEmpty() ? null : bean.initMethod(),
                                         // destroy method:
                                         bean.destroyMethod().isEmpty() ? null : bean.destroyMethod(),
                                         // @PostConstruct / @PreDestroy method:
                                         null, null);
            addBeanDefinitions(defs, def);
        }
    }
}
```

下面就可以写一些获取BeanDefinition的方法，举几个有代表性的例子：

- 根据名称获取一个bd：可以直接获取，因为名称是全局唯一的。
- 通过类型获取多个bd：我们上文也提到了，context中可能存在多个声明类型相同的Bean，所以都要获取出来，并且可以根据@Order注解进行排序。@Order默认时Integer.MAX_VALUE。
- 通过类型获取单个bd：还是上面的道理，所以如果获取到多个时，需要先判断这些中有没有@Primary注解，如果没有或不止一个就需要抛出异常。

## CreateBean&StrongDependenciesInjection

下面我们针对生成的BeanDefinition来生成具体的Bean。

Bean一共有四种依赖注入方式：

1. 构造方法注入，例如：

```java
@Component
public class Hello {
    JdbcTemplate jdbcTemplate;
    public Hello(@Autowired JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}
```

2. 工厂方法注入，例如：

```java
@Configuration
public class AppConfig {
    @Bean
    Hello hello(@Autowired JdbcTemplate jdbcTemplate) {
        return new Hello(jdbcTemplate);
    }
}
```

3. Setter方法注入，例如：

```java
@Component
public class Hello {
    JdbcTemplate jdbcTemplate;

    @Autowired
    void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}
```

4. 字段注入，例如：

```java
@Component
public class Hello {
    @Autowired
    JdbcTemplate jdbcTemplate;
}
```

我们可以发现，前两种创建Hello时，JdbcTemplate这个Bean的方式属于创建和注入是一体的，也就是说，在创建Hello这个类时，就需要将JdbcTemplate创建出来并注入，这被称为**强依赖**。

而后两种被称为**弱依赖**，因为它可以Hello在创建之后，在创建JdbcTemplate，随后通过反射注入。

对于强依赖的循环依赖，我们无法解决，就算是我们自己编码也无法下手。

而对于弱依赖，如果是自己编码则可以`先new，再set`，也就意味着IOC也可以通过这种方式解决循环依赖。

下面就开始创建Bean并在初始时就进行强依赖注入：

- 首先我们需要使用一个set来保存正在初始化的Bean，用于检查循环依赖，使用全局唯一的BeanName判重。
- 接着，我们先对含有@Configuration的Bean进行处理，创建Bean工厂，为随后的FactoryMethod做准备
- 随后创建创建所有剩余的未初始化的Bean。

```java
private Set<String> creatingBeanNames;
public AnnotationConfigApplicationContext(Class<?> configClass, PropertyResolver propertyResolver) {
	// ...

    // 创建BeanName检测循环依赖:
    this.creatingBeanNames = new HashSet<>();

    // 创建@Configuration类型的Bean:
    this.beans.values().stream()
        // 过滤出@Configuration:
        .filter(this::isConfigurationDefinition).sorted().map(def -> {
        createBeanAsEarlySingleton(def);
        return def.getName();
    }).collect(Collectors.toList());

    // 创建其他普通Bean:
    createNormalBeans();
}
void createNormalBeans() {
    // 获取BeanDefinition列表:
    List<BeanDefinition> defs = this.beans.values().stream()
        // filter bean definitions by not instantiation:
        .filter(def -> def.getInstance() == null).sorted().collect(Collectors.toList());

    defs.forEach(def -> {
        // 如果Bean未被创建(可能在其他Bean的构造方法注入前被创建):
        if (def.getInstance() == null) {
            // 创建Bean:
            createBeanAsEarlySingleton(def);
        }
    });
}
```

下面就是`createBeanAsEarlySingleton`方法的任务，对不同类型的Bean进行初始化，并解决循环依赖的问题。

- 如果发现了要初始化的Bean已经存在在Set中，那么就抛出异常。
- `Executable`的子类是`Constructor`和`Method`，根据BeanDefinition中初始化的不同使用不同的初始化方式（FactoryMethod或Constructor）
- 获取到方法参数，遍历处理：
- 先拿到当前参数的注解集合，查看是否有`@Value`或`@Autowired`注解。
- 做一些异常判断：
  - 如果要创建的Bean是工厂（`@Configuration`），那么它不能使用@Autowired注入，因为@Configuration是最先注入的，IOC中还没有其他的Bean。
  - `@Value`和`@AutoWired`不能同时在同一个Filed上。
- 针对@Value注解，使用我们内部保存的PropertyResolver来执行属性注入。
- 针对@AutoWired注解：
  - 我们首先拿到字段的BeanDefinition，如果它是必须的（在@Autowired中指定required为ture）并且BeanDefinition为空，那么抛出异常。
  - 我们通过BeanDefinition拿到Instance，如果实例为空，那么我们需要递归调用本方法创建Bean。
- 当所有的参数都准备好后，就可以根据方法创建实例了，将实例赋值给BeanDefinition。

```java
public Object createBeanAsEarlySingleton(BeanDefinition def) {
    if (!this.creatingBeanNames.add(def.getName())) {
        throw new UnsatisfiedDependencyException();
    }
    // 创建方式：构造方法或工厂方法:
    Executable createFn = null;
    if (def.getFactoryName() == null) {
        // by constructor:
        createFn = def.getConstructor();
    } else {
        // by factory method:
        createFn = def.getFactoryMethod();
    }

    // 创建参数:
    final Parameter[] parameters = createFn.getParameters();
    Object[] args = new Object[parameters.length];
    for (int i = 0; i < parameters.length; i++) {
        final Parameter param = parameters[i];
        final Annotation[] paramAnnos = param.getAnnotations();
        final Value value = ClassUtils.getAnnotation(paramAnnos, Value.class);
        final Autowired autowired = ClassUtils.getAnnotation(paramAnnos, Autowired.class);

        // @Configuration类型的Bean是工厂，不允许使用@Autowired创建:
        final boolean isConfiguration = isConfigurationDefinition(def);
        if (isConfiguration && autowired != null) {
            throw new BeanCreationException();
        }

        // 参数需要@Value或@Autowired两者之一:
        if (value != null && autowired != null) {
            throw new BeanCreationException();
        }
        if (value == null && autowired == null) {
            throw new BeanCreationException());
        }
        // 参数类型:
        final Class<?> type = param.getType();
        if (value != null) {
            // 参数是@Value:
            args[i] = this.propertyResolver.getRequiredProperty(value.value(), type);
        } else {
            // 参数是@Autowired:
            String name = autowired.name();
            boolean required = autowired.value();
            // 依赖的BeanDefinition:
            BeanDefinition dependsOnDef = name.isEmpty() ? findBeanDefinition(type) : findBeanDefinition(name, type);
            // 检测required==true?
            if (required && dependsOnDef == null) {
                throw new BeanCreationException();
            }
            if (dependsOnDef != null) {
                // 获取依赖Bean:
                Object autowiredBeanInstance = dependsOnDef.getInstance();
                if (autowiredBeanInstance == null && !isConfiguration) {
                    // 当前依赖Bean尚未初始化，递归调用初始化该依赖Bean:
                    autowiredBeanInstance = createBeanAsEarlySingleton(dependsOnDef);
                }
                args[i] = autowiredBeanInstance;
            } else {
                args[i] = null;
            }
        }
    }

    // 创建Bean实例:
    Object instance = null;
    try {
        if (def.getFactoryName() == null) {
            // 用构造方法创建:
            instance = def.getConstructor().newInstance(args);
        } else {
            // 用@Bean方法创建:
            Object configInstance = getBean(def.getFactoryName());
            instance = def.getFactoryMethod().invoke(configInstance, args);
        }
    } catch (Exception e) {
        throw new BeanCreationException();
    }
    def.setInstance(instance);
    return def.getInstance();
}
```

## WeakDependencyInjection&BeanInitialization

下面就开始进行Bean的字段和set方法注入，然后调用定义好的初始化方法进行初始化。

首先是对Bean进行弱依赖的注入，在`injectProperties`类中，注意是对子类和所有的父类中需要弱引用的字段和方法都进行初始化。

```java
public AnnotationConfigApplicationContext(Class<?> configClass, PropertyResolver propertyResolver) {
    // ...

    // 通过字段和set方法注入依赖:
    this.beans.values().forEach(this::injectBean);

    // 调用init方法:
    this.beans.values().forEach(this::initBean);
}
void injectBean(BeanDefinition def) {
    try {
        injectProperties(def, def.getBeanClass(), def.getInstance());
    } catch (ReflectiveOperationException e) {
        throw new BeanCreationException(e);
    }
}
void injectProperties(BeanDefinition def, Class<?> clazz, Object bean) throws ReflectiveOperationException {
    // 在当前类查找Field和Method并注入:
    for (Field f : clazz.getDeclaredFields()) {
        tryInjectProperties(def, clazz, bean, f);
    }
    for (Method m : clazz.getDeclaredMethods()) {
        tryInjectProperties(def, clazz, bean, m);
    }
    // 在父类查找Field和Method并注入:
    Class<?> superClazz = clazz.getSuperclass();
    if (superClazz != null) {
        injectProperties(def, superClazz, bean);
    }
}
void initBean(BeanDefinition def) {
    // 调用init方法:
    callMethod(def.getInstance(), def.getInitMethod(), def.getInitMethodName());
}
```

下面是对字段和set方法注入的核心代码：

- 首先查看Member上是否有@Value或@AutoWired注解，同时存在或都不存在直接返回。
- 对Member进行安全检查，如果是Static抛出异常，如果是字段的final，抛出异常。如果方法的参数值不是一个，也抛出异常。随后为其设置可访问性。
- 对于@Value使用PropertyResolver进行属性注入。
- 对于@AutoWired，我们从IOC中拿到Bean，如果有required需要并且Bean为空，那么抛出异常。
- 如果不为空，为Filed执行set操作，为Method执行invoke操作。

```java
void tryInjectProperties(BeanDefinition def, Class<?> clazz, Object bean, AccessibleObject acc) throws ReflectiveOperationException {
    Value value = acc.getAnnotation(Value.class);
    Autowired autowired = acc.getAnnotation(Autowired.class);
    if (value == null && autowired == null) {
        return;
    }
    if (value != null && autowired != null) {
        throw new BeanCreationException();
    }
    
    Field field = null;
    Method method = null;
    if (acc instanceof Field f) {
        checkFieldOrMethod(f);
        f.setAccessible(true);
        field = f;
    }
    if (acc instanceof Method m) {
        checkFieldOrMethod(m);
        if (m.getParameters().length != 1) {
            throw new BeanDefinitionException();
        }
        m.setAccessible(true);
        method = m;
    }

    Class<?> accessibleType = field != null ? field.getType() : method.getParameterTypes()[0];
    // @Value注入:
    if (value != null) {
        Object propValue = this.propertyResolver.getRequiredProperty(value.value(), accessibleType);
        if (field != null) {
            field.set(bean, propValue);
        }
        if (method != null) {
            method.invoke(bean, propValue);
        }
    }

    // @Autowired注入:
    if (autowired != null) {
        String name = autowired.name();
        boolean required = autowired.value();
        Object depends = name.isEmpty() ? findBean(accessibleType) : findBean(name, accessibleType);
        if (required && depends == null) {
            throw new UnsatisfiedDependencyException();
        }
        if (depends != null) {
            if (field != null) {
                field.set(bean, depends);
            }
            if (method != null) {
                method.invoke(bean, depends);
            }
        }
    }
}
```

在弱依赖注入完成后，一个Bean的创建和初始化就完成了，接着就需要调用用户提供的初始化方法来初始化Bean，对应`initMethod`或`initMethodName`。

下面是调用初始换方法的核心代码：

- 根据BeanDefinition的不同，调用不同的初始化方法。
- `@Component+@PostConstruct `所指定的方法位于BeanDefinition的`initMethod`中，它是运行时确定的方法，可以直接调用。
- 而采用`@Configuration+@Bean(initinitMethod = "init")`指定的方法位于BeanDefinition的`InitMethodName`中，它只是一个名字，并且有可能在工厂方法中返回的是它的子类，所以我们需要使用实例的getClass方法获取到运行时类，拿到真正的Class才能调用真正的初始化方法（如果使用BeanDefinition中的Class，有可能调用到父类的init方法）。

```java
private void callMethod(Object beanInstance, Method method, String namedMethod) {
    // 调用init/destroy方法:
    try {
        if (method != null) {
            method.invoke(beanInstance);
        } else if (namedMethod != null) {
            // 查找initMethod/destroyMethod="xyz"，注意是在实际类型中查找:
            Method named = ClassUtils.getNamedMethod(beanInstance.getClass(), namedMethod);
            named.setAccessible(true);
            named.invoke(beanInstance);
        }
    } catch (ReflectiveOperationException e) {
        throw new BeanCreationException(e);
    }
}
```

## BeanPostProcessor

接着，我们需要实现BeanPostProcessor，它提供了可以替换Bean的功能。常用场景就是动态生成代理Bean，用来替换原始的Bean，可以用来实现AOP。

由于BeanPostProcessor的引入，依赖注入又有了一点新问题：

对于Controller中依赖注入带事务的Service，Service又注入了JdbcTemplate用来操作数据库，其依赖关系应该如下：

![image-20231209202851474](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/3918f9259f92f355018eb19cfd148908.png)

为什么呢？

- 假设将JdbcTemplate注入UserServiceProxy，我们都知道动态代理实际上是在Proxy中存放了目标类UserService，每次调用Proxy的方法时调用UserService的同名方法，如果将JdbcTemplate注入Proxy中，UserService调用JdbcTemplate就会出现NullPointerExection。
- 假设将UserService注入Controller，很明显我们在Controller中就无法使用带事务的ServiceProxy，也就意味着，我们的声明式事务就失效了。

对应到我们的IOC上，实际上也是两步，假设我们要让B替换为BP：

1. 对于依赖于B的Bean，我们需要将BP注入。

2. 对于B所依赖的Bean，我们需要将Bean注入到B。

对于第一点，我们可以在@Configuration的Bean注入后，立即判断是否有Bean实现了BeanPostProcessor，对这些Bean优先初始化，并加入到集合中，之后再初始化普通的Bean：

```java
// 存放所有的BeanPostProcessor
private List<BeanPostProcessor> beanPostProcessors = new ArrayList<>();
public AnnotationConfigApplicationContext(Class<?> configClass, PropertyResolver propertyResolver) {
    // ...

    // 创建@Configuration类型的Bean:
    this.beans.values().stream()
        // 过滤出@Configuration:
        .filter(this::isConfigurationDefinition).sorted().map(def -> {
        createBeanAsEarlySingleton(def);
        return def.getName();
    }).collect(Collectors.toList());

    // 创建BeanPostProcessor类型的Bean:
    List<BeanPostProcessor> processors = this.beans.values().stream()
        // 过滤出BeanPostProcessor:
        .filter(this::isBeanPostProcessorDefinition)
        // 排序:
        .sorted()
        // instantiate and collect:
        .map(def -> {
            return (BeanPostProcessor) createBeanAsEarlySingleton(def);
        }).collect(Collectors.toList());

    this.beanPostProcessors.addAll(processors);

    // 创建其他普通Bean:
    createNormalBeans();

    // ...
}

```

对于`createBeanAsEarlySingleton`方法也需要一点改动：

- 首先BeanPostProcessor不能依赖其他Bean，不允许使用@Autowired创建
- 在设置实例之后，调用BeanPostProcessor链中的postProcessBeforeInitialization方法，对Bean进行处理。如果实例被改变，那么需要更新实例对象。

```java
public Object createBeanAsEarlySingleton(BeanDefinition def) {
    // ...
    for (int i = 0; i < parameters.length; i++) {
        // BeanPostProcessor不能依赖其他Bean，不允许使用@Autowired创建:
        final boolean isBeanPostProcessor = isBeanPostProcessorDefinition(def);
        if (isBeanPostProcessor && autowired != null) {
            throw new BeanCreationException();
        }
    }
	// ...
    def.setInstance(instance);
    // 调用BeanPostProcessor处理Bean:
    for (BeanPostProcessor processor : beanPostProcessors) {
        Object processed = processor.postProcessBeforeInitialization(def.getInstance(), def.getName());
        if (processed == null) {
            throw new BeanCreationException();
        }
        // 如果一个BeanPostProcessor替换了原始Bean，则更新Bean的引用:
        if (def.getInstance() != processed) {
            def.setInstance(processed);
        }
    }
    return def.getInstance();
}
```

同时，我们需要将原始的Bean保留下来，所以在BeanPostProcessor提供一个方法获取原始的Bean，由子类实现：

```java
default Object postProcessOnSetProperty(Object bean, String beanName) {
    return bean;
}
```

我们需要在弱依赖注入和初始化时，获取到原始的实例对象

```java
void injectBean(BeanDefinition def) {
    // 获取Bean实例，或被代理的原始实例:
    final Object beanInstance = getProxiedInstance(def);
    try {
        injectProperties(def, def.getBeanClass(), beanInstance);
    } catch (ReflectiveOperationException e) {
        throw new BeanCreationException(e);
    }
}
```

我们需要在初始化时，也获取到原始的实例对象，在初始化之后，调用BeanPostProcessor链中的postProcessAfterInitialization方法，对Bean进行处理。如果实例被改变，那么需要更新实例对象。

```java
void initBean(BeanDefinition def) {
    // 获取Bean实例，或被代理的原始实例:
    final Object beanInstance = getProxiedInstance(def);

    // 调用init方法:
    callMethod(beanInstance, def.getInitMethod(), def.getInitMethodName());

    // 调用BeanPostProcessor.postProcessAfterInitialization():
    beanPostProcessors.forEach(beanPostProcessor -> {
        Object processedInstance = beanPostProcessor.postProcessAfterInitialization(def.getInstance(), def.getName());
        if (processedInstance != def.getInstance()) {
            def.setInstance(processedInstance);
        }
    });
}
```

getProxiedInstance方法核心代码如下，注意获取原始Bean时需要倒序解析：

因为会有处理多次代理的情况，即一个原始Bean，比如`UserService`，被一个事务处理的`BeanPostProcsssor`代理为`UserServiceTx`，又被一个性能监控的`BeanPostProcessor`代理为`UserServiceMetric`，还原的时候，对`BeanPostProcsssor`做一个倒序，先还原为`UserServiceTx`，再还原为`UserService`。

```java
private Object getProxiedInstance(BeanDefinition def) {
    Object beanInstance = def.getInstance();
    // 如果Proxy改变了原始Bean，又希望注入到原始Bean，则由BeanPostProcessor指定原始Bean:
    List<BeanPostProcessor> reversedBeanPostProcessors = new ArrayList<>(this.beanPostProcessors);
    Collections.reverse(reversedBeanPostProcessors);
    for (BeanPostProcessor beanPostProcessor : reversedBeanPostProcessors) {
        Object restoredInstance = beanPostProcessor.postProcessOnSetProperty(beanInstance, def.getName());
        if (restoredInstance != beanInstance) {
            beanInstance = restoredInstance;
        }
    }
    return beanInstance;
}
```

## End

最后，我们抽象出来面对用户和框架内部的接口`ApplicationContext`和`ConfigurableApplicationContext`。

同时，创建ApplicationContextUtils，在IOC启动时，将其引用注入到static类变量中。