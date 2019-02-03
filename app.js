const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

//EJSをViewエンジンとして用いるよう設定
app.set("view engine", "ejs");

//bodyParserを使用
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//トップページにアクセスされた場合
app.get("/", async (req, res) => {
    res.render('index', {
        title: "Welcome to Signage!",
    });
});

app.listen(port, () => {
    console.log("server is ready>:)");
});