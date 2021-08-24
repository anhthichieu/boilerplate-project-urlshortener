import express from "express";
const app = express();
import mongooseModules from 'mongoose';
const { Schema, connect, model, connection } = mongooseModules;
import { generate } from "shortid";

// Basic Configuration
import cors from "cors";
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));
app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

/** Connect to MoongoDB **/
import dotenv from 'dotenv'
dotenv.config() // Load .env file
const mongoURI = process.env.MONGO_URI;
const connectOptions = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log(`Error`, err);
  console.log(`Connected to MongoDB`);
});

// const db = connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function() {
//   console.log(`we're connected!`);
// });
// /** End of connection to MoongoDB **/

import MyApp from './src/routes/URLShortenModel.js';
MyApp(app);

// Create a Schema
// const urlShortenSchema = new Schema({
//   originalUrl: String,
//   shortUrl: String
// });

// let urlShortenModel = model("urlShortenModel", urlShortenSchema);

// /**  Use body-parser to Parse POST Request s*/
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// /** Get data form POST */
// app.post("/api/shorturl", async function (req, res) {
//   const { url: originalUrl } = req.body;
//   const urlCode = generate();

//   // Check if url is in valid format
//   const protocol = /^https?:\/\//i;
//   if (!originalUrl.match(protocol)) return res.json({ error: "Invalid URL" });

//   // Check if the URL is already in the database
//   let currentURL = await urlShortenModel
//     .findOne({
//       originalUrl: originalUrl
//     })
//     .exec();

//   if (!currentURL) {
//     // If the query returns null then add a new instance to database
//     currentURL = new urlShortenModel({
//       originalUrl: originalUrl,
//       shortUrl: urlCode
//     });
//     currentURL.save(function(err, data) {
//       if (err) {
//         return console.error(err);
//       }
//     });
//   }

//   res.json({
//     original_url: currentURL.originalUrl,
//     short_url: currentURL.shortUrl
//   });
// });

// /**GET API for redirecting to Original URL*/
// app.get("/api/shorturl/:shortcode", async (req, res) => {
//   const urlCodeInput = req.params.shortcode;
//   const isCodeExisted = await urlShortenModel.exists({
//     shortUrl: urlCodeInput
//   });

//   if (isCodeExisted) {
//     const { originalUrl: url } = await urlShortenModel.findOne({
//       shortUrl: urlCodeInput
//     });
//     res.redirect(url);
//   } else {
//     res.json({ error: "No short URL found for the given input" });
//   }
// });