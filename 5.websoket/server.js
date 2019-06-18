let express = require("express");
let app = express();
// node 进行socket协议通信的包
let Websocket = require('ws');
// 创建websoket 服务器
let wss = new Websocket.Server({ port: 3000 })// port 在3000端口进行websoket通信  Websoket服务器
// 创建连接
wss.on("connection", function (ws) {
    //on("message")监听外部发送过来的消息
    ws.on("message", function (data) {
        console.log(data);
        // 给前端回话
        ws.send("你是个好人")
    });
});
