const express = require("express");
const cors = require("cors");
require("dotenv").config();

const memoriesRouter = require("../routes/memories");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Gem Memory API running" });
});

app.use("/memories", memoriesRouter);

module.exports = app;
