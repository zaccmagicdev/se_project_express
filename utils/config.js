require("dotenv").config();

const DEFAULT_SECRET = "DefaultforDev";

const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_SECRET;

module.exports = {
  JWT_SECRET
}