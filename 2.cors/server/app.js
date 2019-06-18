//clinet1 用来写接口数据
let express = require("express");
let app = express();
//携带cookie跨域 域名不能使用通配符
let whitelist = ["http://localhost:4000"];
app.use(function (req, res, next) {
    //拿到访问域名
    let origin = req.headers.origin;
    //所有的请求都会先走中间件  这里的req，和res和下面的req，res是一个
    //允许哪个域访问
    if (whitelist.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        //设置允许哪个方法跨域
        res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,OPTIONS");
        //允许携带哪个请求头跨域
        res.header("Access-Control-Allow-Headers", "name");
        //允许携带cookie跨域Credentials
        res.header("Access-Control-Allow-Credentials", true);
        //设置预检请求存活时间 如果发了一次预检请求 一段时间内就不在发送预检请求了 时间单位是s
        res.header("Access-Control-Max-Age", 6);
        //设置允许前端获取的响应头
        res.header("Access-Control-Expose-Headers", "Access-Control-Allow-Methods");
        //对于预检请求 直接返回成功
        if (req.method == "OPTIONS") return res.end();
        next();
    }
});
app.put("/cors1", function (req, res) {
    //后端需要取到前端传递过来的回调函数名称和参数
    res.send("1234");
});
app.listen(3000, function () {
    console.log("服务器1启动，端口3000");
});