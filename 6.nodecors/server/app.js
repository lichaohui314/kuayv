let express = require("express");
let app = express();
app.get("/nodecors", function (req, res) {
    res.send("1234");
})
app.listen(3000, function () {
    console.log("静态服务器已经启动，端口3000");
});

