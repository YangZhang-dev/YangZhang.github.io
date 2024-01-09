---
title: snmp-Java

order: 1
author: zzys
date: 2023-12-05
category:
- 笔记
tag:
- snmp
---

## snmp4j

Java中的snmp客户端是snmp4j，使用maven将其导入：

```xml
<dependency>
    <groupId>org.snmp4j</groupId>
    <artifactId>snmp4j</artifactId>
    <version>2.5.0</version>
</dependency>
```

### 实体

下面是在snmp4j包中我们会用到的实体：

- Snmp：代表一个snmp实例，我们用它来向远程主机发送请求。
- CommunityTarget：即社区，我们需要对它进行配置。
- PDU：数据协议单元。
- ResponseEvent：代表一个返回事件，里面有请求体，返回体，错误信息等
- TransportMapping：在snmp4j中代表传输层的协议。

## 初始化

```java
    /**
     * 初始化snmp以及Target
     */
    public static void initSnmp() throws IOException {
        target = new CommunityTarget();
        // 设置团体
        target.setCommunity(new OctetString("private"));
        // 设置远程主机的地址
        target.setAddress(new UdpAddress("127.0.0.1/161"));
        // 设置重试次数
        target.setRetries(1);
        // 设置超时时间
        target.setTimeout(3000);
        // 设置使用的snmp版本
        target.setVersion(SnmpConstants.version2c);
        /**
         * 初始化snmp
         * 在snmp4j中，使用{@link org.snmp4j.TransportMapping}来表示传输层的协议。
         * 可以增加多个TransportMapping来支持多种协议(TCP UDP SSH)：snmp.addTransportMapping(new DefaultTcpTransportMapping());
         * 底层是启动了多个线程来监听不同的端口，从而支持多种协议。
         * new DefaultUdpTransportMapping()如果不带参数代表随机一个使用一个本地ip+端口，
         * 如果想要指定本地ip+端口，可以使用new DefaultUdpTransportMapping(new UdpAddress("127.0.0.1/8888"));
         */
        snmp = new Snmp(new DefaultUdpTransportMapping());
        // 遍历所有的Mapping，开启监听
        snmp.listen();
    }
```

上面是对CommunityTarget和snmp的初始化，CommunityTarget需要我们设置团体名，远程主机的地址，重试次数，超时时间。

snmp的初始化见代码，如果不需要多个协议，只需要写`snmp = new Snmp(new DefaultUdpTransportMapping());`这一行即可

## 发送消息

```java
/**
     * 发送消息
     *
     * @param pdu {@link PDU}
     */
public static void sendSnmpRequest(PDU pdu) throws Exception{
    // 发送PDU 并且接收响应事件
    ResponseEvent responseEvent = snmp.send(pdu, target);
    // 解析响应，获取返回值
    PDU response = responseEvent.getResponse();
    // 判断请求是否出错，如timeOut，远程地址错误
    if (responseEvent.getError() != null || response == null){
        System.out.println("Operation Error:" + responseEvent.getError());
    } else {
        // 判断返回值是否有错，如noSuchObject
        if (response.getErrorStatus() == PDU.noError) {
            // 输出变量绑定表
            Vector<? extends VariableBinding> vbs = response.getVariableBindings();
            for (VariableBinding vb : vbs) {
                System.out.println(vb + " , type is " + vb.getVariable().getSyntaxString());
            }
        } else {
            System.out.println("Response Error:" + response.getErrorStatusText());
        }
    }
}
```

此方法接收一个PDU，使用初始化好的communityTarget发送，下面的`set get get-next get-bulk`都使用这个方法发送消息，解释见上面的注释。

## 主循环

```java
public static void main(String[] args) {
    try {
        // 初始化
        initSnmp();
        while(true) {
            // 根据不同的类型发送不同的消息
            Scanner scanner = new Scanner(System.in);
            System.out.println("请输入OID：");
            String oid = scanner.nextLine();
            System.out.println("请输入选项：");
            System.out.println("1.set");
            System.out.println("2.get");
            System.out.println("3.getNext");
            System.out.println("4.getBulk");
            int type = scanner.nextInt();
            switch (type) {
                case 1 -> {
                    System.out.println("请输入值：");
                    scanner = new Scanner(System.in);
                    String val = scanner.nextLine();
                    System.out.println("val = " + val);
                    SnmpSet(oid,val);
                }
                case 2 -> SnmpGet(oid);
                case 3 -> SnmpGetNext(oid);
                case 4 -> {
                    System.out.println("请输入数量：");
                    scanner = new Scanner(System.in);
                    int num = scanner.nextInt();
                    SnmpGetBulk(oid,num);
                }
                default -> {
                    System.out.println("输入错误");
                    return;
                }
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

创建一个无线循环不断的执行用户的操作。

## Set

```java
public static void SnmpSet(String oid,String val) throws Exception {
    PDU pdu = new PDU();
    pdu.setType(PDU.SET);
    pdu.add(new VariableBinding(new OID(oid), new OctetString(val)));
    sendSnmpRequest(pdu);
}
```

初始化一个PDU，设置类型为set，在PDU中可以加入多个要操作的变量，然后发送。

## Get

```java
public static void SnmpGet(String oid) throws Exception{
    PDU pdu = new PDU();
    pdu.setType(PDU.GET);
    pdu.add(new VariableBinding(new OID(oid)));
    sendSnmpRequest(pdu);
}
```

初始化一个PDU，设置类型为get，然后发送。

## Get-Next

```java
public static void SnmpGetNext(String oid) throws Exception{
    PDU pdu = new PDU();
    pdu.setType(PDU.GETNEXT);
    pdu.add(new VariableBinding(new OID(oid)));
    sendSnmpRequest(pdu);
}
```

初始化一个PDU，设置类型为get-next，然后发送。

## Get-Bulk

```java
public static void SnmpGetBulk(String oid,int number) throws Exception{
    PDU pdu = new PDU();
    pdu.setType(PDU.GETBULK);
    pdu.setMaxRepetitions(number);
    pdu.add(new VariableBinding(new OID(oid)));
    sendSnmpRequest(pdu);
}
```

初始化一个PDU，设置类型为get-bulk，同时可以设置我们想要一次性获取的数量，然后发送。

## 代码

```java
package com.zzys.snmp;

import org.snmp4j.CommunityTarget;
import org.snmp4j.PDU;
import org.snmp4j.Snmp;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;

import java.io.IOException;
import java.util.Scanner;
import java.util.Vector;

/**
 * MySnmp
 *
 * @author YangZhang
 * @createTime 2023/12/05/ 12:50
 */
public class MySnmp {
    private static CommunityTarget target;
    private static Snmp snmp;

    public static void main(String[] args) {
        try {
            // 初始化
            initSnmp();
            while(true) {
                // 根据不同的类型发送不同的消息
                Scanner scanner = new Scanner(System.in);
                System.out.println("请输入OID：");
                String oid = scanner.nextLine();
                System.out.println("请输入选项：");
                System.out.println("1.set");
                System.out.println("2.get");
                System.out.println("3.getNext");
                System.out.println("4.getBulk");
                int type = scanner.nextInt();
                switch (type) {
                    case 1 -> {
                        System.out.println("请输入值：");
                        scanner = new Scanner(System.in);
                        String val = scanner.nextLine();
                        System.out.println("val = " + val);
                        SnmpSet(oid,val);
                    }
                    case 2 -> SnmpGet(oid);
                    case 3 -> SnmpGetNext(oid);
                    case 4 -> {
                        System.out.println("请输入数量：");
                        scanner = new Scanner(System.in);
                        int num = scanner.nextInt();
                        SnmpGetBulk(oid,num);
                    }
                    default -> {
                        System.out.println("输入错误");
                        return;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void SnmpSet(String oid,String val) throws Exception {
        PDU pdu = new PDU();
        pdu.setType(PDU.SET);
        pdu.add(new VariableBinding(new OID(oid), new OctetString(val)));
        sendSnmpRequest(pdu);
    }
    public static void SnmpGet(String oid) throws Exception{
        PDU pdu = new PDU();
        pdu.setType(PDU.GET);
        pdu.add(new VariableBinding(new OID(oid)));
        sendSnmpRequest(pdu);
    }

    public static void SnmpGetBulk(String oid,int number) throws Exception{
        PDU pdu = new PDU();
        pdu.setType(PDU.GETBULK);
        pdu.setMaxRepetitions(number);
        pdu.add(new VariableBinding(new OID(oid)));
        sendSnmpRequest(pdu);
    }

    public static void SnmpGetNext(String oid) throws Exception{
        PDU pdu = new PDU();
        pdu.setType(PDU.GETNEXT);
        pdu.add(new VariableBinding(new OID(oid)));
        sendSnmpRequest(pdu);
    }

    /**
     * 发送消息
     *
     * @param pdu {@link PDU}
     */
    public static void sendSnmpRequest(PDU pdu) throws Exception{
        // 发送PDU 并且接收响应事件
        ResponseEvent responseEvent = snmp.send(pdu, target);
        // 解析响应，获取返回值
        PDU response = responseEvent.getResponse();
        // 判断请求是否出错，如timeOut，远程地址错误
        if (responseEvent.getError() != null || response == null){
            System.out.println("Operation Error:" + responseEvent.getError());
        } else {
            // 判断返回值是否有错，如noSuchObject
            if (response.getErrorStatus() == PDU.noError) {
                // 输出变量绑定表
                Vector<? extends VariableBinding> vbs = response.getVariableBindings();
                for (VariableBinding vb : vbs) {
                    System.out.println(vb + " , type is " + vb.getVariable().getSyntaxString());
                }
            } else {
                System.out.println("Response Error:" + response.getErrorStatusText());
            }
        }
    }

    /**
     * 初始化snmp以及Target
     */
    public static void initSnmp() throws IOException {
        target = new CommunityTarget();
        // 设置团体
        target.setCommunity(new OctetString("private"));
        // 设置远程主机的地址
        target.setAddress(new UdpAddress("127.0.0.1/161"));
        // 设置重试次数
        target.setRetries(1);
        // 设置超时时间
        target.setTimeout(3000);
        // 设置使用的snmp版本
        target.setVersion(SnmpConstants.version2c);
        /**
         * 初始化snmp
         * 在snmp4j中，使用{@link org.snmp4j.TransportMapping}来表示传输层的协议。
         * 可以增加多个TransportMapping来支持多种协议(TCP UDP SSH)：snmp.addTransportMapping(new DefaultTcpTransportMapping());
         * 底层是启动了多个线程来监听不同的端口，从而支持多种协议。
         * new DefaultUdpTransportMapping()如果不带参数代表随机一个使用一个本地ip+端口，
         * 如果想要指定本地ip+端口，可以使用new DefaultUdpTransportMapping(new UdpAddress("127.0.0.1/8888"));
         */
        snmp = new Snmp(new DefaultUdpTransportMapping());
        // 遍历所有的Mapping，开启监听
        snmp.listen();
    }
}
```