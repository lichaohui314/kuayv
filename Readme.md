#### 跨域

1. jsonp 只支持 get 方法 原理就是 src 引入 js

- 后端代码

```
  后端需要取到前端传递过来的回调函数名称和参数
 app.get("/cors", function(req, res) {
   let { cb, wd } = req.query;
  res.send(`${cb}({data:"你好"})`);
});
```

- 前端代码

```
  $.ajax({
        url: "http://localhost:3000/cors",
        type: "GET",
        dataType: "jsonp",
        data: {
          wd: "你好"
        },
        jsonp: "cb",
        success: function(data) {
          console.log(data);
        }
  });
```

2. cors 跨域
   跨域资源共享 cross-origin resoure sharing
   需要后端配置才可以 可以支持所有方法
   简单请求 直接允许 post 和 get 跨域
   复杂请求发送的时候 会先发一个预检请求(先问服务器支持不支持发送请求的类型)
   预检请求 => OPTIONS
3. postmessage  
   data：顾名思义，是传递来的消息
   source：发送消息的窗口对象
   origin：发送消息窗口的源（协议+主机+端口号）
   // 确保 a、b 页面能访问  
   http://localhost:3000/a.html
   http://localhost:4000/b.html

```
  A页面引入B页面
	<iframe id = "frame" src="http://localhost:4000/b.html" frameborder="0" onload="load()"></iframe>

   load=()=>{
        let frame= document.getElementById('frame');
        frame.contentWindow.postMessage('你是好人','http://localhost:4000');
        window.onmessage=function(e){
            console.log(e.data)
        }
    }
     我是b页面
    <script>
        window.onmessage=function(e){
          console.log(e.data);
          e.source.postMessage('你是坏人',e.origin)
        }
    </script>
```

4. location.hash  
   `有a、b、c 三个页面 a、b 同域 c是单独 a想访问c a 给c传一个hash值 c 把hash值传递给b,b将结果放到a的hash值中 c页面需要动态创建iframe`

```
  let iframe =document.createElement('iframe');
  iframe.src ='http://localhost:3000/b.html#youare';
  document.body.appendChild(iframe)
   # b 页面 放值   window.parent.parent.location.hash =location.hash;
   # a页面监听
   window.onhashchange=function(){
            console.log(location.hash)
        }
```

5. window.name

```
   a、b 同一个域名 c独立
    a获取c的数据，a先引用c c把值放在window.name上，把a的引用地址改到b
   a页面 firstload 防止死循环

   let firstload = true;
   function load(){
        let frame= document.getElementById('frame');

        if(firstload){
            frame.src ='http://localhost:3000/b.html';
           firstload = false;

        }else{
            console.log(frame.contentWindow.name)
        }
  #b页面
  #c页面
  window.name = '你好'
```

6. docmument.domain

```
只适合使用在二级域名的情况
模拟 在etc/hots 设置二级域名
hosts文件设置
```
127.0.0.1       www.lch.com
127.0.0.1       vip.lch.com
127.0.0.1       svip.lch.com
```
可以通过以下3个地址进行访问
http://www.lch.com:3000/a.html
http://vip.lch.com:3000/a.html
http://svip.lch.com:3000/a.html

 window hots目录
 c:\windows\system32\drivers\etc
  访问的页面
  http://svip.lch.com:3000/a.html  http://b.abc.com:3000/b.html

 document.domain  只适合二级域名
 qq.com 一级域名   vip.qq.com  music.qq.com 二级域名
```
```
 1. 流程 a 页面引入b页面
 <iframe src="http://svip.lch.com:4000/b.html" frameborder="0" onload="load()" id="frame"></iframe>
 2. b页面设置全局变量和一级域名
    document.domain = "lch.com";
    window.a = "你好";
 3. a页面设置一级域名并且在iframe 加载完成之后调用load方法通过frame.contentWindow.a拿到b页面的全局变量
    document.domain = "lch.com"
    function load() {
        console.log(frame.contentWindow.a);
    }
```

7. websoket   双工协议

```
前端 一般用socket.io进行兼容
let socket = new WebSocket('ws:localhost:3000');
    socket.onopen=function(){
        socket.send('你好')
    }
    socket.onmessage=function(e){
      console.log(e.data)
    }
后端  npm install ws
let express = require('express');
let app = express();
//npm install ws
let Websocket =require('ws');
<!-- 创建websoket服务器 -->
let wss = new Websocket.Server({port:3000})
<!-- 创建连接和发送消息 -->
wss.on('connection',function(ws){
    ws.on('message',function(data){
      console.log(data)
      ws.send('你也好')
    })
})
```

8. webpack 代理

```
vue-cli 2.0
    config/index.js
    proxyTable: {
      '/':{
        target:'http://localhost:3000',
        changeOrigin:true,
        pathRewrite:{
          '^/':'/'
        }
      }
    }
    config/dev.env.js
    module.exports = merge(prodEnv, {
      NODE_ENV: '"development"',
      API_HOST:'/'  +需要加API_HOST
   })
   vue-cli3.0
   在vue.config.js里面进行配置
    devServer: {
       proxy: 'http://localhost:3000'
     }
```

9. nginx 反向代理

10. node 中间件代理
