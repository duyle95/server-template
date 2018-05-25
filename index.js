const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const router = require("./router");
const app = express();

mongoose.connect(
  "mongodb://duyn55:password@ds217970.mlab.com:17970/thesis-development",
  err => console.log(err)
);

app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));

router(app);

const port = process.env.PORT || 3090;

app.listen(port, () => console.log("listening on port " + port));
