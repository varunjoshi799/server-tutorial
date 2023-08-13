const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const bodyParser = require('body-parser');
require('dotenv').config()
const db = require('services/dbConnect.js');


// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

// persist image 
app.post("/persist-image", (req, res) => {
  // collected image from user
  const data = {
    title: req.body.title,
    image: req.body.image
  }

  // upload image
  cloudinary.uploader.upload(data.image)
    .then((image) => {
      db.pool.connect((err, client) => {
        // insert query to run if upload is successful
        const insertQuery = `INSERT INTO images (title, cloudinary_id, image_url)
          VALUES($1, $2, $3) RETURNING *`;
        const values = [data.title, image.public_id, image.secure_url];
      })

      // execute query
      client.query(insertQuery, values)
        .then((result) => {
          result = result.rows[0]

          // send successful response
          res.status(201).send({
            status: "success",
            data: {
              message: "Image Uploaded Successfully",
              title: result.title
              cloudinary_id: result.cloudinary_id,
              image_url: result.image_url
            }
          })
        }).catch((e) => {
          res.status(500).send({
            message: "failure",
            e
          })
        })
    }).catch((err) => {
      res.status(500).send({
        message: "failure",
        err
      })
    })
})

// image upload API
app.post("/image-upload", (request, response) => {
    // collected image from a user
    const data = {
      image: request.body.image,
    }

    // upload image here
    cloudinary.uploader.upload(data.image)
    .then((result) => {
      response.status(200).send({
        message: "success",
        result,
      });
    }).catch((error) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });
});

module.exports = app;