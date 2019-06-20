#### 跨域

1. josnp 只支持 get 方法,原理是引入通过 src 引入 script

- 后端代码

```javascript
//后端需要取到前端传递过来的回调函数名称和参数
app.get("/cors", function(req, res) {
  let { cb, wd } = req.query;
  res.send(`${cb}({data:"你好"})`);
});
```

- 前端代码

```javascript
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
3. postmessage+iframe 跨域
   - data：顾名思义，是传递来的消息
   - source：发送消息的窗口对象
   - origin：发送消息窗口的源（协议+主机+端口号）
   - 确保 a、b 页面能访问
   - http://localhost:3000/a.html
   - http://localhost:4000/b.html

```html
<!-- 页面引入b页面 -->
<iframe
  id="frame"
  src="http://localhost:4000/b.html"
  frameborder="0"
  onload="load()"
></iframe>
<script>
  load = () => {
    let frame = document.getElementById("frame");
    frame.contentWindow.postMessage("你是好人", "http://localhost:4000");
    window.onmessage = function(e) {
      console.log(e.data);
    };
  };
  //我是b页面
  window.onmessage = function(e) {
    console.log(e.data);
    e.source.postMessage("你是坏人", e.origin);
  };
</script>
```

4. docmument.domain 只适合使用在二级域名的情况

```markdown
window hots 目录 c:\windows\system32\drivers\etc
mac 在 etc/hosts 设置二级域名
hosts 文件设置
127.0.0.1 www.ry.com
127.0.0.1 vip.ry.com
127.0.0.1 svip.ry.com
//可以通过以下 3 个地址进行访问
http://www.ry.com:4000/b.html
http://vip.ry.com:4000/b.html
http://svip.ry.com:4000/b.html
qq.com 一级域名 vip.qq.com music.qq.com qq 的二级域名
```

```html
<!-- 访问的页面http://vip.ry.com:3000/a.html  http://svip.ry.com:4000/b.html -->
<!-- 1.a页面引入b页面 -->
<iframe
  src="http://svip.ry.com:4000/b.html"
  frameborder="0"
  onload="load()"
  id="frame"
></iframe>
//2. b页面设置全局变量和一级域名
<script>
  document.domain = "ry.com";
  window.a = "你好";
</script>
//3. a页面设置一级域名并且在iframe
加载完成后调用load方法通过frame.contentWindow.a 拿到b页面的全局变量
<script>
  document.domain = "ry.com";
  function load() {
    console.log(frame.contentWindow.a);
  }
</script>
```

5. websoket 双工协议

```javascript
//file:///Users/ruanye/Desktop/cross-domain/5.websocket/index.html
//前端 一般用socket.io进行兼容
let socket = new WebSocket('ws:localhost:3000');
    socket.onopen=function(){
        socket.send('你好')
    }
    socket.onmessage=function(e){
      console.log(e.data)
 }
//后端  npm install ws
let express = require('express');
let app = express();
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

6. webpack 代理

```javascript
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
      API_HOST:'/' // +需要加API_HOST
   })
   // vue-cli3.0在vue.config.js里面进行配置
    devServer: {
       proxy: 'http://localhost:3000'
     }
```

7. node 中间层代理

```javascript
//服务端访问服务端不存在跨域
// 接口端服务器代码(axios在node里面也可以使用)
app.get("/nodecors", function(req, res) {
  res.send("1234");
});
//客户端代码 客户端在客户端的服务器里面用axios请求请求接口服务器
app.get("/a", async function(req, res) {
  let data = await axios.get("http://localhost:3000/nodecors");
  let result = data.data;
  res.json(result);
});
```

8. window.name + iframe 跨域

```javascript
    //a页面、b页面 同一个域名 c页面自己一个域名
    //a获取c的数据，a先引用c c把值放在window.name上，iframe加载完成后把a的引用地址改到b
    // a页面  firame的window.name并没有改变
    //firstload 防止死循环
    let firstload = true;
    function load(){
        let frame= document.getElementById('frame');
       if(firstload){
            frame.src ='http://localhost:3000/b.html';
           firstload = false;

        }else{
            console.log(frame.contentWindow.name)
    }
   //b页面
   //c页面
  window.name = '你好'
```

9. location.hash+ iframe
   `有 a、b、c 三个页面 a、b 同域 c 是独立域
   - a 页面通过 iframe 引入 c 页面，并且传入一个 hash 值 #name
   - c 动态创建 ifame,iframe 的 src 是 b 页面,c 通过 ifrmae 把 hash 值传递给 b,把 ifram 添加到 dom 里面
   - b 页面--> 父亲--> c 页面-->父亲-->a 页面
   - c 页面可以通过 b 页面的 location.hash 拿到 c 传给 b 的 hash 值
   - b 页面将拿到 hash 放到 a 的 hash 值中
   - a 页面监听 hash 值改变事件能拿到 c 传过来 hash 值

```javascript
let iframe = document.createElement("iframe");
iframe.src = "http://localhost:3000/b.html#youare";
document.body.appendChild(iframe);
//b 页面 放值
window.parent.parent.location.hash = location.hash;
//a页面监听
window.onhashchange = function() {
  console.log(location.hash);
};
```

10. nginx 反向代理
    window conf 文件夹里面 找到 nginx.conf
    - mac 前往 /usr/local/etc/nginx
    - http 里面 server 表示虚拟服务器器
    - server_name www.ruanye.com
    - ping 命令加域名 可以测试连接 `ping www.baidu.com`
    - server
      listen 80 监听端口号
      server_name 虚拟服务器的名字
    - nginx 命令
      - 重新加载 nginx -s reload
      - 退出 nginx -s quit

```json
//配置跨域头
http {
  ###start####
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Headers X-Requested-With;
  add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
  ###end ###
}
//配置代理的域名 proxy_pass 需要代理的域名
 server {
        listen 8081;
        server_name  www.ai.com;
        location / {
        proxy_pass http://localhost:3000;
        root   html;
        index  index.html index.htm;
   }
```