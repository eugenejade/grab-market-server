const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const models = require("./models");

app.use(express.json());
app.use(cors());
app.get("/products", (req, res) => {
  models.Product.findAll({
    //limit : 1,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"],
  })
    .then((result) => {
      console.log("products : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      console.log("error : ", error);
      res.send("에러발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller } = body;
  if (!name || !description || !price || !seller) {
    res.send("모든 필드를 입력해주세요.");
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.send("상품 업로드에 문제가 발생");
    });
  res.send({
    body,
  });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("product : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send("상품 조회에 에러가 발생했습니다.");
    });
});

app.listen(port, () => {
  console.log("그랩에 쇼핑몰 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync()
    .then(() => {
      console.log("db 연결 성공");
    })
    .catch((err) => {
      console.log(err);
      console.log("db 연결 에러");
      process.exit();
    });
});
