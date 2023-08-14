const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

exports.imageUpload = (req, res) => {
    // collected image from user
    const data = {
        image: req.body.image,
    };

    // uploaded imagerouter
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
};
