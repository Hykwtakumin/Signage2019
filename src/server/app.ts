import * as express from "express";
import * as bodyParser from "body-parser";
import * as ejs from "ejs";
const app = express();
const port = process.env.PORT || 3000;

//EJSをViewエンジンとして用いるよう設定
app.set("view engine", "ejs");
//bodyParserを使用
app.use(bodyParser.urlencoded({extended: true}));

//staticファイルをpublicから配信
app.use(express.static("public"));

//トップページにアクセスされた場合
app.get("/", async (req, res) => {
    /*基本はmobileにリダイレクトさせる*/
    res.redirect("/mobile");
});

app.get("/mobile", async (req, res) => {
    /*モバイルページを返す*/
    res.render('mobile', {
        title: "ConnecTouch Mobile",
    });
});

// app.get("/signage/omiya", async (req, res) => {
//     /*サイネージページを返す*/
//     res.render('signage', {
//         title: "ConnecTouch Signage!",
//     });
// });
const omiya = encodeURI("大宮");
const shinjuku = encodeURI("新宿");
const akihabara = encodeURI("秋葉原");
const yokohama = encodeURI("横浜");
const fujisawa = encodeURI("藤沢")

app.get(`/${omiya}|${shinjuku}|${akihabara}|${yokohama}|${fujisawa}`, async (req, res) => {
    /*サイネージページを返す*/
    res.render('signage', {
        title: "ConnecTouch Signage!",
    });
});

app.listen(port, () => {
    console.log(`server started in port ${port}`);
});
