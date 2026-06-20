const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose-connection");
const config = require("config");

mongoose.connect(config.get("MONGO_URI"))

const db = mongoose.connection;

db.on("error", (err) => {
    debug("Connection Error:", err.message);
});

db.once("open", () => {
    debug("MongoDB Connected");
});

module.exports = db;