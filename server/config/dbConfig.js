const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo db connected successfully");
  } catch (error) {
    console.error("Mongo db connection error: ", error);
    process.exit(1);
  }
};

connectDB();

const connection = mongoose.connection;

connection.on("error", (err) => {
  console.log("Mongo db connection error: ", err);
});

module.exports = mongoose;
