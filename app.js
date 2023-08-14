const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const db = require('./services/dbConnect.js')
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

app.get("/", (req, res) => {
    res.json({
        message: "Request received",
    });
});

// image upload API
app.post("/image-upload", (req, res) => {
    // collected image from user
    const data = {
        image: req.body.image,
    };

    // uploaded image
    cloudinary.uploader
        .upload(data.image)
        .then((result) => {
            res.status(200).send({
                message: "successfully uploaded image",
                result,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "failed to upload image",
                err,
            });
        });
});

// persist image
app.post("/persist-image", (request, response) => {
    // collected image from a user
    const data = {
      title: request.body.title,
      image: request.body.image
    }
  
    // upload image here
    cloudinary.uploader.upload(data.image)
    .then((image) => {
      db.pool.connect((err, client) => {
        // inset query to run if the upload to cloudinary is successful
        const insertQuery =` INSERT INTO images (title, cloudinary_id, image_url) 
           VALUES($1,$2,$3) RETURNING *`;
        const values = [data.title, image.public_id, image.secure_url];
  
        // execute query
        client.query(insertQuery, values)
        .then((result) => {
          result = result.rows[0];
  
          // send success response
          response.status(201).send({
            status: "success",
            data: {
              message: "Image Uploaded Successfully",
              title: result.title,
              cloudinary_id: result.cloudinary_id,
              image_url: result.image_url,
            },
          })
        }).catch((e) => {
          response.status(500).send({
            message: "failure",
            e,
          });
        })
      })  
    }).catch((error) => {
      response.status(500).send({
        message: "failure",
        error,
      });
    });
  });

module.exports = app;
