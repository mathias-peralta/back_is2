const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const indexRouter = require("./routers/indexRouter");
const userRouter = require("./routers/userRouter");

//settings
app.set("port", process.env.PORT || 3001);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: false,
  })
);

//middleware
app.use(morgan("dev"));
app.use(cors());

//routes
app.use(indexRouter);
app.use(userRouter);

app.listen(app.get("port"), () => {
  console.log("server listen on port:", app.get("port"));
});
