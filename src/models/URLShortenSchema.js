// Create a Schema
import mongooseModules from 'mongoose';
const { Schema, model } = mongooseModules;

export const urlShortenSchema = new Schema({
  originalUrl: String,
  shortUrl: String
});

// model("urlShortenModel", urlShortenSchema);
