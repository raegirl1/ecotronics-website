const mongoose = require("mongoose");

const { DB_CONN, DB_USER, DB_PW } = process.env;

mongoose
  .connect(DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("Successfully connected to DB"))
  .catch(console.error);