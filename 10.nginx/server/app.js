let express = require("express");
let app = express();
app.get("/a", function (req, res) {
    res.send("1234");
});
app.listen(3001, function () {
    console.log("服务器已经启动，端口3000");
});
