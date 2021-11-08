const express = require("express");
const config = require("config");
const winston = require("winston");
const morgan = require("morgan");
const configErrors = require("./startup/configErrors");
const logging = require("./startup/logging");
const routes = require("./startup/routes");
const db = require("./startup/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
logging();
configErrors();
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const FrontApp = config.get("FrontEndUrl");
app.use(cors({ origin: FrontApp }));
db();
routes(app);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  try {
    console.log(config.get("name"));
    console.log(`listening to ${port}`);
    console.log(`Front end app is : ${config.get("FrontEndUrl")}`);
    winston.info(`Listening to Port ${port} without errors`);
  } catch (ex) {
    console.log(ex.message);
    winston.error(ex.message, ex);
  }
});

module.exports = server;
