const express = require("express");
const app = express();
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
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

module.exports = app;
