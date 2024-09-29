"use strict";

require("express-async-errors");

const express = require("express");
const path = require('path');
const cors = require("cors");
const routes = require("./routes");
const uploadConfig = require("./configs/upload.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(routes);

const PORT = 3335;

app.listen(PORT, () =>
  console.info(`Server running in http://localhost:${PORT}`)
);
