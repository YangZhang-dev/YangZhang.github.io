---
title: snmp压力测试

order: 1
author: zzys
date: 2023-12-19
category:
- 笔记
tag:
- snmp
---

本文采用jmeter对前一篇文章中的snmp管理端接口进行压力测试，使用wireshark进行抓包，使用性能监视器对管理端pc进行性能监视。

## Jmeter

[JMeter压力测试工具](https://blog.csdn.net/qq_24391607/article/details/105309171)

### 安装

首先主机上要有jdk，并且已经配好环境变量。

对于windows：[点击下载jmeter](https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.2.zip)，下载zip包后，解压出来，在`bin`目录下有一个名叫`jmeter.bat`的文件，双击即可运行。注意弹出的cmd窗口不可关闭。

修改中文步骤如下图：

![image-20231220133315880](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/140b50c2e4ca3d9252c201f849e4c668.png)

### 简单介绍

jmeter是一个压力测试工具，可以为各种协议进行压测，最常见的是对HTTP接口进行测试。我们这里选择对java本地代码进行压测。

左侧是一个Test Plan，代表一个**压测计划**。我们可以右键新增一个最普通的**线程组**，代表计划中的一个测试组，线程组可以配置并发数，循环次数，每组之间的等待时间。在线程组中可以新增一个实际的压测目标，可以是一个HTTP接口，SMTP接口，TCP接口等等，也可以是一个Junit测试方法，当然也可以是一个Java普通方法。

如图就可以新增一个Java请求，接下来的具体做法在下面介绍：

![image-20231220133834026](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/ceda038ec8a4c8ba42232917e66ccf94.png)

## 测试代码

### 代码修改

如果想要使用Jmeter对Java本地方法进行压测，那么我们就需要符合Jmeter提出的规范，具体来说就是要实现Jmeter提供的一个接口。

在pom文件中新增以下依赖：

```xml
<dependency>
    <groupId>org.apache.jmeter</groupId>
    <artifactId>ApacheJMeter_core</artifactId>
    <version>3.0</version>
</dependency>
<dependency>
    <groupId>org.apache.jmeter</groupId>
    <artifactId>ApacheJMeter_java</artifactId>
    <version>3.0</version>
</dependency>
```

新建一个测试类，实现`JavaSamplerClient`接口，重写方法。

```java
public class TestMySnmp implements JavaSamplerClient {
    @Override
    public void setupTest(JavaSamplerContext javaSamplerContext) { }

    @Override
    public SampleResult runTest(JavaSamplerContext javaSamplerContext) {
        SampleResult sr = new SampleResult();
        try{
            sr.sampleStart();
            MySnmp snmp = new MySnmp();
            String result = snmp.TestGet("192.168.72.130/161","public","1.3.6.1.2.1.6.2.0");
            sr.setResponseData(result,null);
            sr.setSuccessful(true);
        } catch (Exception e){
            sr.setSuccessful(false);
            sr.setSamplerData(e.getMessage());
            e.printStackTrace();
        }
        sr.sampleEnd();
        return sr;
    }

    @Override
    public void teardownTest(JavaSamplerContext javaSamplerContext) {
    }

    @Override
    public Arguments getDefaultParameters() {
        return null;
    }
}
```

我们这里对上一次的Snmp管理端代码做了一些修改：

- 由于只需要对一个Oid进行简单的Get操作，我们只留下了一个TestGet方法
- 将成员变量设置为类变量，防止并发冲突
- 注意最后要对snmp进行关闭监听，不然会出现错误

```java
public class MySnmp {
    private CommunityTarget target;
    private Snmp snmp;
    public String TestGet(String ip,String community,String oid) throws Exception {
        try{
            init(ip,community);
            PDU pdu = new PDU();
            pdu.setType(PDU.GET);
            pdu.add(new VariableBinding(new OID(oid)));
            return TestSendSnmpRequest(pdu);
        }finally {
            snmp.close();
        }
    }
    public String TestSendSnmpRequest(PDU pdu) throws Exception{
        ResponseEvent responseEvent = snmp.send(pdu, target);
        PDU response = responseEvent.getResponse();
        if (responseEvent.getError() != null || response == null){
            throw new RuntimeException("error");
        } else {
            if (response.getErrorStatus() == PDU.noError) {
                Vector<? extends VariableBinding> vbs = response.getVariableBindings();
                for (VariableBinding vb : vbs) {
                    return vb.getVariable().toString();
                }
            } else {
                throw new RuntimeException("error");
            }
        }
        throw new RuntimeException("error");
    }

    public void init(String ip, String community)  {
        target = new CommunityTarget();
        target.setCommunity(new OctetString(community));
        target.setAddress(new UdpAddress(ip));
        target.setRetries(1);
        target.setTimeout(3000);
        target.setVersion(SnmpConstants.version2c);
        try {
            snmp = new Snmp(new DefaultUdpTransportMapping());
            snmp.listen();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
```

最后使用maven进行打包，我们要额外加入打包插件，将我们使用的第三方jar包也打入我们的jar包中。

在pom文件中加入以下代码，然后complie即可。

```xml
<build>
    <plugins>
        <!-- Maven Assembly Plugin -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>2.4.1</version>
            <configuration>
                <!-- get all project dependencies -->
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
            <executions>
                <execution>
                    <id>make-assembly</id>
                    <!-- bind to the packaging phase -->
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

### 部署jar包

接下来，我们对打好的jar包进行部署。

打开项目目录下的target目录，其中有一个类似`snmp-1.0-SNAPSHOT-jar-with-dependencies.jar`的jar包，将其复制，放置到`apache-jmeter-5.6.2\lib\ext`。

现在再次启动jmeter，创建java request，会发现多了一个TestGet测试选项，如果没有那就是出现问题了，需要自己再检查一下，可以点击右侧的下三角看一下。

![image-20231220135140019](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/0a16a100e4f34bc94ab0ce3f46ec1492.png)

## wireshark

在本次实验，我们需要用到wireshark进行抓包，所以我们需要确定，当前的请求是走的哪张网卡。

首先需要说的是，如果你使用127.0.0.1，它实际上是不走物理网卡的，你能够在wireshark中抓到它发送的包，但是你在性能监测中无法具体的看到网络的变化。我这里为了方便使用了虚拟机，没有选择借用其他的人的电脑。VMware，Oracle VM VirtualBox都可以，或者省事在HCL里创建PC和Host相连也行。创建好主机后需要去网上搜一下Linux配置Snmp，我这里就不再赘述。

那么要怎么判断使用的是哪张网卡呢？如果你连接的是其他人的pc，那么应该就是无线网卡。如果你设置的是虚拟机，那么先靠猜，如果用的是HCL，其实在连线时就已经选择了网卡了。如果使用的是虚拟机，大致也是可以通过名称区分的。但是对于VMware，有很多张名字很像的网卡，这时就需要去判断一下了。

我们首先获取到虚拟机ip，打开适配器选项页面：

![image-20231220141827218](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e6d2507b01dc6e4e6f1549463510e2c2.png)

对类似的网卡挨个右键选择状态，点击详细信息，根据ip地址和掩码计算一下是否在一个网络即可。

![image-20231220141952535](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/e19987da5ab19581a80ad571cbbafed8.png)

我们确认网卡后，进入wireshark，输入过滤器snmp就完成了wireshark的准备工作，我这里抓的是VMware-8的虚拟网卡。

## 性能监视

[Windows 性能监视器的基本指标说明（CPU,内存,硬盘参数） - Rocken.li - 博客园 (cnblogs.com)](https://www.cnblogs.com/xdot/p/10110396.html)

在windows下自带性能监视工具，可以直接搜索性能监视器打开即可

![image-20231220142935557](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/cf211aff59e32e9a4898bc3fdafe361e.png)

接下来设置我们这次要用到的指标：cpu工作占比，可用内存数（MB），网卡总接收发送数（B）

![image-20231220144052970](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/fa5b886e556c545024d465f63e2c141a.png)

注意对于虚拟机模拟出来的虚拟网卡，在network interface中是不存在的，需要在network adapter中寻找。

此时可能会出现一条线一直在100或一直处于较低的状态，这是我们需要调整一下它的权重。我们右键点击指标，点击比例，可以调整到正常波动大小。

<img src="https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/928ce3957a718f86af8271a328ca2838.png" alt="image-20231220144401961" style="zoom:50%;" />

这是我调整的比例，可以参考一下：

![image-20231220144559249](https://blog-zzys.oss-cn-beijing.aliyuncs.com/articles/c16aba8794727a95e5b7ec1889557ad9.png)

现在性能监视也准备好了。

## 问题

### oom

[JMeter内存溢出：java.lang.OutOfMemoryError: Java heap space - 海布里Simple - 博客园 (cnblogs.com)](https://www.cnblogs.com/ailiailan/p/11562367.html)

###  No buffer space available (maximum connections reached?): bind

[Windows 产生大量 TIME_WAIT 连接](https://zhuanlan.zhihu.com/p/604394878)

[Windows time_wait过多解决办法](https://www.cnblogs.com/asdyzh/p/15190323.html)

snmp.close()