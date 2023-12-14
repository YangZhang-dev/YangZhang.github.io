---
title: JdbcTemplate-Transaction
order: 3
author: zzys
date: 2023-12-12
category:
- 项目
tag:
- spring
- JDBC
- Transaction
---

本文为廖雪峰老师的[手写Spring](https://www.liaoxuefeng.com/wiki/1539348902182944)笔记中的JDBC和事务一节，仅作个人学习使用。

我们在本节会完成一个JdbcTemplate，可以覆盖绝大多数数据库操作。

同时会实现声明式事务`@Transcation`。

## JdbcTemplate

我们首先提供一个默认的数据源以及数据库连接池`HikariCP`。

配置项在yml上长这样：

```yaml
summer:
  datasource:
    url: 
    driver-class-name: 
    username: 
    password: 
```

我们创建一个JdbcConfiguration，用来管理这个包下的所有要注册的Bean，并将默认的数据数据源注入：

```java
@Configuration
public class JdbcConfiguration {

    @Bean(destroyMethod = "close")
    DataSource dataSource(
            // properties:
            @Value("${summer.datasource.url}") String url,
            @Value("${summer.datasource.username}") String username,
            @Value("${summer.datasource.password}") String password,
            @Value("${summer.datasource.driver-class-name:}") String driver,
            @Value("${summer.datasource.maximum-pool-size:20}") int maximumPoolSize,
            @Value("${summer.datasource.minimum-pool-size:1}") int minimumPoolSize,
            @Value("${summer.datasource.connection-timeout:30000}") int connTimeout
    ) {
        var config = new HikariConfig();
        config.setAutoCommit(false);
        config.setJdbcUrl(url);
        config.setUsername(username);
        config.setPassword(password);
        if (driver != null) {
            config.setDriverClassName(driver);
        }
        config.setMaximumPoolSize(maximumPoolSize);
        config.setMinimumIdle(minimumPoolSize);
        config.setConnectionTimeout(connTimeout);
        return new HikariDataSource(config);
    }
}
```

然后开始创建我们的JdbcTemplate。

JdbcTemplate中使用到了大量的基于回调函数模板方法，并且设计到了许多函数式接口，我们在这里对重要的类先展开说明。

### RowMapper

RowMapper是一个用于将ResultSet转换为指定类型的FunctionalInterface，

> FunctionalInterface首先是一个接口，然后就是在这个接口里面**只能有一个抽象方法**。

RowMapper的定义如下：

```java
@FunctionalInterface
public interface RowMapper<T> {
    @Nullable
    T mapRow(ResultSet rs, int rowNum) throws SQLException;
}
```

我们可以基于它创建很多子类，如

```java
class StringRowMapper implements RowMapper<String> {
    static StringRowMapper instance = new StringRowMapper();
    @Override
    public String mapRow(ResultSet rs, int rowNum) throws SQLException {
        // 将结果集合中的第一列数据转换为String类型
        return rs.getString(1);
    }
}
```

代码中提供了StringRowMapper，NumberRowMapper，BooleanRowMapper，BeanRowMapper。前三种都是转换为一些基础类型，而最后一种是转换为自定义的Bean。

```java
public class BeanRowMapper<T> implements RowMapper<T> {

    final Logger logger = LoggerFactory.getLogger(getClass());
    // Bean的Class
    Class<T> clazz;
    // Bean的构造器
    Constructor<T> constructor;
    // Bean的字段
    Map<String, Field> fields = new HashMap<>();
    // Bean的set方法
    Map<String, Method> methods = new HashMap<>();

    public BeanRowMapper(Class<T> clazz) {
        this.clazz = clazz;
        try {
            this.constructor = clazz.getConstructor();
        } catch (ReflectiveOperationException e) {
            throw new DataAccessException();
        }
        for (Field f : clazz.getFields()) {
            String name = f.getName();
            this.fields.put(name, f);
        }
        for (Method m : clazz.getMethods()) {
            Parameter[] ps = m.getParameters();
            if (ps.length == 1) {
                String name = m.getName();
                // 到这一步相当于只向methods中放入以set开头并且参数个数为一的方法
                if (name.length() >= 4 && name.startsWith("set")) {
                    String prop = Character.toLowerCase(name.charAt(3)) + name.substring(4);
                    this.methods.put(prop, m);
                }
            }
        }
    }

    @Override
    public T mapRow(ResultSet rs, int rowNum) throws SQLException {
        T bean;
        try {
            bean = this.constructor.newInstance();
            ResultSetMetaData meta = rs.getMetaData();
            int columns = meta.getColumnCount();
            // 遍历MetaData中的所有列，和Methods做匹配
            for (int i = 1; i <= columns; i++) {
                String label = meta.getColumnLabel(i);
                Method method = this.methods.get(label);
                if (method != null) {
                    // 执行set方法
                    method.invoke(bean, rs.getObject(label));
                } else {
                    // 如果没有该字段的set方法，尝试直接向field直接set值
                    Field field = this.fields.get(label);
                    if (field != null) {
                        field.set(bean, rs.getObject(label));
                    }
                }
            }
        } catch (ReflectiveOperationException e) {
            throw new DataAccessException();
        }
        return bean;
    }
}
```

### CallBack

接着我们来看一下代码中定义的回调函数：

- ConnectionCallback：定义拿到Connection后的行为（一般都是创建PreparedStatement，执行PreparedStatementCallback#doInPreparedStatement）

  ```java
  @FunctionalInterface
  public interface ConnectionCallback<T> {
      @Nullable
      T doInConnection(Connection con) throws SQLException;
  }
  ```

- PreparedStatementCallback：用于定义SQL的类型，也就是拿到PreparedStatement后具体的执行逻辑，可以是查询，可以是其他的语句，由我们自己定义。

  ```java
  @FunctionalInterface
  public interface PreparedStatementCallback<T> {
      @Nullable
      T doInPreparedStatement(PreparedStatement ps) throws SQLException;
  }
  ```

- PreparedStatementCreator：创建PreparedStatement，可以选择是否返回自动增长的主键（主要是在Insert中使用，同时MySQL必须设置自动增长）

  ```java
  @FunctionalInterface
  public interface PreparedStatementCreator {
      PreparedStatement createPreparedStatement(Connection con) throws SQLException;
  }
  ```

### Template

现在我们来从上往下看JdbcTemplate的核心代码：

- 首先我们需要注入DataSource，放入成员变量中。
- preparedStatementCreator方法规定了一个最基础的PreparedStatementCreator方法，在其中对sql进行预编译（放置sql注入，提升效率），向PreparedStatement动态绑定参数。
- 最核心的就是`execute(ConnectionCallback<T> action)`方法，每次获取一个Connection，然后执行ConnectionCallback#doInConnection方法，相当于把业务方法抽象出来，在这个方法中专心的做有关连接的事情。
- 然后就是`execute(PreparedStatementCreator psc, PreparedStatementCallback<T> action)`方法，它需要传入这两个回调函数，将PreparedStatement的生成和具体要执行的操作隔离起来。
- 其他的方法就都是在此之上构建出来的，对于基础类型，通过Class对象获取到对应的RowMapper，对于Bean类型我们创建一个指定的BeanRowMapper。

```java
public class JdbcTemplate {

    final DataSource dataSource;

    public JdbcTemplate(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    private PreparedStatementCreator preparedStatementCreator(String sql, Object... args) {
        return (Connection con) -> {
            var ps = con.prepareStatement(sql);
            bindArgs(ps, args);
            return ps;
        };
    }

    private void bindArgs(PreparedStatement ps, Object... args) throws SQLException {
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }
    }
}

     public <T> T execute(ConnectionCallback<T> action) throws DataAccessException {
        // 获取新连接:
        try (Connection newConn = dataSource.getConnection()) {
            final boolean autoCommit = newConn.getAutoCommit();
            if (!autoCommit) {
                newConn.setAutoCommit(true);
            }
            T result = action.doInConnection(newConn);
            if (!autoCommit) {
                newConn.setAutoCommit(false);
            }
            return result;
        } catch (SQLException e) {
            throw new DataAccessException(e);
        }
    }
    public <T> T execute(PreparedStatementCreator psc, PreparedStatementCallback<T> action) {
        return execute((Connection con) -> {
            try (PreparedStatement ps = psc.createPreparedStatement(con)) {
                return action.doInPreparedStatement(ps);
            }
        });
    }
    
    public <T> T queryForObject(String sql, RowMapper<T> rowMapper, Object... args) throws DataAccessException {
        return execute(preparedStatementCreator(sql, args),
                // PreparedStatementCallback
                (PreparedStatement ps) -> {
                    T t = null;
                    try (ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            if (t == null) {
                                t = rowMapper.mapRow(rs, rs.getRow());
                            } else {
                                throw new DataAccessException("Multiple rows found.");
                            }
                        }
                    }
                    if (t == null) {
                        throw new DataAccessException("Empty result set.");
                    }
                    return t;
                });
    }

    @SuppressWarnings("unchecked")
    public <T> T queryForObject(String sql, Class<T> clazz, Object... args) throws DataAccessException {
        if (clazz == String.class) {
            return (T) queryForObject(sql, StringRowMapper.instance, args);
        }
        if (clazz == Boolean.class || clazz == boolean.class) {
            return (T) queryForObject(sql, BooleanRowMapper.instance, args);
        }
        if (Number.class.isAssignableFrom(clazz) || clazz.isPrimitive()) {
            return (T) queryForObject(sql, NumberRowMapper.instance, args);
        }
        return queryForObject(sql, new BeanRowMapper<>(clazz), args);
    }

    public <T> List<T> queryForList(String sql, RowMapper<T> rowMapper, Object... args) throws DataAccessException {
        return execute(preparedStatementCreator(sql, args),
                // PreparedStatementCallback
                (PreparedStatement ps) -> {
                    List<T> list = new ArrayList<>();
                    try (ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            list.add(rowMapper.mapRow(rs, rs.getRow()));
                        }
                    }
                    return list;
                });
    }

    public <T> List<T> queryForList(String sql, Class<T> clazz, Object... args) throws DataAccessException {
        return queryForList(sql, new BeanRowMapper<>(clazz), args);
    }

    public Number updateAndReturnGeneratedKey(String sql, Object... args) throws DataAccessException {
        return execute(
                // PreparedStatementCreator
                (Connection con) -> {
                    var ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                    bindArgs(ps, args);
                    return ps;
                },
                // PreparedStatementCallback
                (PreparedStatement ps) -> {
                    int n = ps.executeUpdate();
                    if (n == 0) {
                        throw new DataAccessException("0 rows inserted.");
                    }
                    if (n > 1) {
                        throw new DataAccessException("Multiple rows inserted.");
                    }
                    try (ResultSet keys = ps.getGeneratedKeys()) {
                        while (keys.next()) {
                            return (Number) keys.getObject(1);
                        }
                    }
                    throw new DataAccessException("Should not reach here.");
                });
    }

    public int update(String sql, Object... args) throws DataAccessException {
        return execute(preparedStatementCreator(sql, args),
                // PreparedStatementCallback
                (PreparedStatement ps) -> {
                    return ps.executeUpdate();
                });
    }
}
```

## 声明式事务

在这里我们使用@Transaction来定义声明式事务，同时只支持REQUIRED传播模式即如果当前连接没有事务，声明一个事务，如果由事务，那么就加入。对于隔离级别只能采用数据库默认的隔离级别。

首先定义注解：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface Transactional {
    String value() default "platformTransactionManager";
}
```

其中@Inherited指明注解可被子类继承。

platformTransactionManager说明了默认使用platformTransactionManager为增强逻辑。

所以我们创建一个接口：

```java
public interface PlatformTransactionManager {
}
```

同时创建一个实现类：

- 我们使用ThreadLocal存储当前线程的事务状态，后期可以通过TransactionStatus来实现传播方式。
- 在invoke中，我们首先通过ThreadLocal获取到当前的事务状态，如果存在事务，那么直接执行方法（加入），如果不存在事务，则创建一个事务。
- 操作执行完毕后，执行commit操作。如果有异常抛出则回滚。
- 最后将ThreadLocal清除。

```java
public class TransactionStatus {
    final Connection connection;
    public TransactionStatus(Connection connection) {
        this.connection = connection;
    }
}

public class DataSourceTransactionManager implements PlatformTransactionManager, InvocationHandler {

    static final ThreadLocal<TransactionStatus> transactionStatus = new ThreadLocal<>();

    final Logger logger = LoggerFactory.getLogger(getClass());

    final DataSource dataSource;

    public DataSourceTransactionManager(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        TransactionStatus ts = transactionStatus.get();
        if (ts == null) {
            // start new transaction:
            try (Connection connection = dataSource.getConnection()) {
                final boolean autoCommit = connection.getAutoCommit();
                if (autoCommit) {
                    connection.setAutoCommit(false);
                }
                try {
                    transactionStatus.set(new TransactionStatus(connection));
                    Object r = method.invoke(proxy, args);
                    connection.commit();
                    return r;
                } catch (InvocationTargetException e) {
                    TransactionException te = new TransactionException(e.getCause());
                    try {
                        connection.rollback();
                    } catch (SQLException sqle) {
                        te.addSuppressed(sqle);
                    }
                    throw te;
                } finally {
                    transactionStatus.remove();
                    if (autoCommit) {
                        connection.setAutoCommit(true);
                    }
                }
            }
        } else {
            // join current transaction:
            return method.invoke(proxy, args);
        }
    }
}
```

为了实现加入事务的功能，我们需要对execute进行改造，如果当前存在一个事务连接，那么直接使用当前连接：

```java
public <T> T execute(ConnectionCallback<T> action) throws DataAccessException {
    // 尝试获取当前事务连接:
    Connection current = TransactionalUtils.getCurrentConnection();
    if (current != null) {
        try {
            return action.doInConnection(current);
        } catch (SQLException e) {
            throw new DataAccessException(e);
        }
    }
    // 获取新连接:
    try (Connection newConn = dataSource.getConnection()) {
        final boolean autoCommit = newConn.getAutoCommit();
        if (!autoCommit) {
            newConn.setAutoCommit(true);
        }
        T result = action.doInConnection(newConn);
        if (!autoCommit) {
            newConn.setAutoCommit(false);
        }
        return result;
    } catch (SQLException e) {
        throw new DataAccessException(e);
    }
}
public class TransactionalUtils {
    @Nullable
    public static Connection getCurrentConnection() {
        TransactionStatus ts = DataSourceTransactionManager.transactionStatus.get();
        return ts == null ? null : ts.connection;
    }
}
```