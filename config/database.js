const mongoose = require("mongoose");
const { MONGODB_URL } = process.env;
exports.connect = () => {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connection Sucessful. ");
    })
    .catch((err) => {
      console.log("DB connection failed", err);
      process.exit(1);
    });
};
