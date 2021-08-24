import mongooseModules from 'mongoose';
const { model } = mongooseModules;
import shortID from '../middlewares/shortID.js';
import { urlShortenSchema } from '../models/urlShortenSchema.js'
import express from "express";
let urlShortenModel = model("urlShortenModel", urlShortenSchema);

export default function MyApp(app) {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  /** Get data form POST */
  app.post("/api/shorturl", async function (req, res) {
    const { url: originalUrl } = req.body;
    const urlCode = shortID();

    // Check if url is in valid format
    const protocol = /^https?:\/\//i;
    if (!originalUrl.match(protocol)) return res.json({ error: "Invalid URL" });

    // Check if the URL is already in the database
    let currentURL = await urlShortenModel.findOne({
        originalUrl: originalUrl
        }).exec();

    if (!currentURL) {
        // console.log("foo");
        // If the query returns null then add a new instance to database
        currentURL = new urlShortenModel({
          originalUrl: originalUrl,
          shortUrl: urlCode
        });
        currentURL.save(function(err, data) {
          if (err) return console.error(err);
        });
    }

    res.json({
      original_url: currentURL.originalUrl,
      short_url: currentURL.shortUrl
    });
  });

  /**GET API for redirecting to Original URL*/
  app.get("/api/shorturl/:shortcode", async (req, res) => {
    const urlCodeInput = req.params.shortcode;
    const isCodeExisted = await urlShortenModel.exists({
      shortUrl: urlCodeInput
    });

    if (isCodeExisted) {
      const { originalUrl: url } = await urlShortenModel.findOne({
        shortUrl: urlCodeInput
      });
      res.redirect(url);
    } else {
      res.json({ error: "No short URL found for the given input" });
    }
  });
};