const express = require("express");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const db = require("../services/dbConnect");
const router = express.Router();

// Importing controllers
const imageUpload = require("./controllers/imageUpload");
const persistImage = require("./controllers/persistImage");
const retrieveImage = require("./controllers/retrieveImage");
const deleteImage = require("./controllers/deleteImage");
const updateImage = require("./controllers/updateImage");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

router.get("/", (req, res) => {
    res.json({
        message: "Request received",
    });
});

// image upload API
router.post("/image-upload", imageUpload.imageUpload);

// persist image
router.post("/persist-image", persistImage.persistImage);

// retrieve image
router.get("/retrieve-image/:cloudinary_id", retrieveImage.retrieveImage);

// delete image
router.delete("/delete-image/:cloudinary_id", deleteImage.deleteImage);

// update image
router.put("/update-image/:cloudinary_id", updateImage.updateImage);

module.exports = router;
