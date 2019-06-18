// client1 用来写接口
let express = require("express");
let app = express();
app.get("/cors", function (req, res) {
    // 后端需要取到前端传递过来的回调函数名称和参数
    let { cb, wd } = req.query;
    res.send(`${cb}({data:"你好"})`);
});
app.listen(3000, function () {
    console.log("服务器1启动,端口号3000")
});