import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import cors from "cors";
import bodyParser from "body-parser";
import mongoMessages from "./messageModel.js";

//app config
const app = express();
const port = process.env.PORT || 9000;

//middlewares
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Authorization, x-auth-token, content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", false);
  next();
});

app.use(cors());

//db config
const mongoURI =
  "mongodb+srv://admin:admin@cluster0.jcum7.mongodb.net/whatsappDb?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const pusher = new Pusher({
  appId: "1102911",
  key: "43ed4f9ddd227fd87595",
  secret: "8398d40906b667d5f6e0",
  cluster: "ap2",
  useTLS: true,
});

mongoose.connection.once("open", () => {
  console.log("db is connected  ");
  const changeStream = mongoose.connection.collection("messages").watch();
  changeStream.on("change", (change) => {
    pusher.trigger("messages", "newMessage", {
      change: change,
    });
  });
});

//api routes
app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/save/message", (req, res) => {
  const dbMessage = req.body;
  console.log(dbMessage);
  mongoMessages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/retrieve/conversation/", (req, res) => {
  mongoMessages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
//listen

app.listen(port, () => console.log(`listening on local host${port}`));
