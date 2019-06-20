let express = require("express");
let app = express();
app.use(express.static(__dirname));
app.listen(4000, function () {
    console.log("客户端2服务器已经启动，端口4000");
});
