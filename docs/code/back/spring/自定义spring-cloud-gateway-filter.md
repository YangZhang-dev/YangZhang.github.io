---
title: 自定义spring-cloud-gateway-filter
order: 3
author: zzys
date: 2023-09-14
category:
- 笔记
tag:
- spring cloud
- gateway
---

参考文章：

- [Spring Cloud Gateway 自定义过滤器](https://blog.csdn.net/qq_43437874/article/details/121626379) 
- [Spring Cloud : Gateway 网关过滤器](https://blog.csdn.net/zouliping123456/article/details/116128179)
- [Spring Cloud Gateway 4 自定义Filter](https://www.cnblogs.com/chenglc/p/13139407.html)

## 官方Filter

在spring cloud Gateway中，存在两种过滤器。

### Gateway Filter

`gateway filter`会作用在指定的路由，需要手动配置在`spring.cloud.gateway.routes[i].filters`下，下面是官方提供的filter：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/301b7c1b90a8140c51f1d80e610178ca.png" alt="image-20231008085452456" style="zoom:67%;" />

上面的信息也可以去`org.springframework.cloud.gateway.filter.factory`包下查看，毕竟版本不同有些参数名可能是会改变的。

以重定向过滤器为例：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/70a6780380048b7a9a6c50fb0fa38352.png" alt="image-20231007181010218" style="zoom:67%;" />

下面是Config内部类，也就是我们要配置的信息：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/58553fac2ff7371d037daac8acf8027c.png" alt="image-20231007181147402" style="zoom:67%;" />

### Global Filter

另一种是`Global filter`应用在所有路由上的过滤器，无需手动配置，官方提供的如下：

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/a834c0f1b874eb37ad537a2737a96ee8.png" alt="image-20231008085528922" style="zoom: 67%;" />

## 自定义Filter

当有个性化的业务需求时，可以自定义过滤器。

### Gateway Filter

在自定义GatewayFilter时，有两种方法。

一种是重写`GatewayFilter`和`Ordered`接口，示例代码如下：

```java
@Slf4j
public class RequestLogGatewayFilter implements GatewayFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 获取请求路径
        URI uri = exchange.getRequest().getURI();
        log.info("获取到请求路径：{}", uri.toString());
        return chain.filter(exchange);
    }

    /**
     * 设置过滤器执行顺序，数值越低，优先级越搞
     */
    @Override
    public int getOrder() {
        return 0;
    }
}
```

同时需要将其注入springIOC中：

```java
@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customerRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route(r -> r.path("/app1/**")
                        .filters(f -> f.filter(new RequestLogGatewayFilter()))
                        .uri("http://localhost:9000")
                )
                .build();
    }
}
```

另一种是比较推荐的，实现过滤器工厂的父接口`AbstractGatewayFilterFactory`，重写apply方法，返回一个`GatewayFilter`。同时在构造方法中将Config的Class传给父工厂。

```java
@Slf4j
@Component
public class RequestLogGatewayFilterFactory extends AbstractGatewayFilterFactory<Config> {

    public RequestLogGatewayFilterFactory() {
        super(Config.class);
    }
    @Override
    public GatewayFilter apply(Config config) {
        return new GatewayFilter() {
            @Override
            public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
                // 获取请求路径
                URI uri = exchange.getRequest().getURI();
                log.info("获取到请求路径：{}", uri.toString());
                //
                log.info("配置属性：{}", config.getName());
                return chain.filter(exchange);
            }

            @Override
            public String toString() {
                return GatewayToStringStyler.filterToStringCreator(RequestLogGatewayFilterFactory.this).toString();
            }
        };
//      return (exchange,chain)->{
//      };
    }
    
    @Data
    public class Config {
        private String name;
    }
}
```

然后在配置文件中加入：

```yaml
spring:
  cloud:
    gateway:
      enabled: true
      routes:
      - id: app-service001 # 路由唯一ID
        uri: http://localhost:9000    # 目标URI,
        predicates:   # 断言，为真则匹配成功
        # 匹配亚洲上海时间 2021-11-29：17:42:47 以后的请求
        # - After=2021-11-29T17:42:47.000+08:00[Asia/Shanghai]
        - Path=/app1/** # 配置规则Path，如果是app1开头的请求，则会将该请求转发到目标URL
        filters:
          - RequestLog=config
```

### Global Filter

实现自定义Golbal Filter只需要实现`GlobalFilter`和`Ordered`接口即可，可以在代码中匹配路径，示例代码如下：

```java
@Component
@Slf4j
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    @Autowired
    ObjectMapper objectMapper;

    // 放行路径，可以编写配置类，配置在YML中
    private static final String[] SKIP_PATH = {"/app1/login", "/app1/skip/**"};

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 1. 判断是否放行路径
        String requestPath = exchange.getRequest().getPath().pathWithinApplication().value();
        boolean match = Arrays.stream(SKIP_PATH).map(path -> path.replaceAll("/\\*\\*", "")).anyMatch(path -> path.startsWith(requestPath));
        if (match) {
            return chain.filter(exchange);
        }
        // 2. 判断是否包含Oauth2 令牌
        String authorizationHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (StringUtils.isEmpty(authorizationHeader) ) {
            // 如果消息头中没有 Authorization ，并且不是 Bearer开头，则抛出异常
            ServerHttpResponse response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            response.getHeaders().add("Content-Type", "application/json;charset=UTF-8");
            String result = "";
            try {
                Map<String, Object> map = new HashMap<>(16);
                map.put("code", HttpStatus.UNAUTHORIZED.value());
                map.put("msg", "当前请求未认证，不允许访问");
                map.put("data", null);
                result = objectMapper.writeValueAsString(map);
            } catch (JsonProcessingException e) {
                log.error(e.getMessage(), e);
            }
            DataBuffer buffer = response.bufferFactory().wrap(result.getBytes(StandardCharsets.UTF_8));
            return response.writeWith(Flux.just(buffer));
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
```

