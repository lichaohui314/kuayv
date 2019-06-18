// server用来写接口数据
let express = require("express")
let app = express()
// 携带cookie跨域  域名不能使用通配符
let whitelist = ["http://localhost:4000"];
app.use(function (req, res, next) {
    // 拿到访问域名
    let origin = req.header.origin;
    console.log(req.headers);
    // 所有的请求都会先走中间件 这里的req和res和下面的req res是一个
    // 允许哪个域访问
    if (whitelist.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        // 设置允许那个方法跨域
        res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE");
        // 允许携带那个请求头跨域
        res.header("Access-Control-Allow-Headers", "name");
        // 允许携带cookie跨域
        res.header("Access-Control-Allow-Credentials", true);
        next()
    }

})
app.put("/cors", function (req, res) {
    // 后端需要取到前端传递过来的回调函数名称和参数 
    res.send("1234")
})
app.listen(3001, function () {
    console.log("server下的服务器启动，端口号3001")
})