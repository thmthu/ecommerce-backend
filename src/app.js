const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");

const { default: helmet } = require("helmet");
const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Nguồn gốc frontend của bạn
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);
require("./dbs/init.mongodb");

app.use("/", require("./routes"));
app.use((req, res, next) => {
  const error = new Error("kooo Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: `${error.message}` || "Internal server error",
  });
});

module.exports = app;