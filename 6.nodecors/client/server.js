let express = require("express");
let app = express();
let axios = require("axios");
app.use(express.static(__dirname));
// axios在node服务端也可以使用   服务端访问服务端是不存在跨域问题的
app.get("/a", async function (req, res) {
    let data = await axios.get("http://localhost:3000/nodecors");
    let resulet = data.data;
    res.json(resulet);
})
app.listen(4000, function () {
    console.log("静态服务器已经启动，端口4000");
});
