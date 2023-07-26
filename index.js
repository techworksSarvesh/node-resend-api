require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 4000;
const { Resend } = require('resend');
const cors = require("cors");
const resend = new Resend(process.env.RESEND_DKEY);
const { v4: uuid } = require("uuid");
let imageName = ""
const fs = require("fs")
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('uploads'));


// Set up the storage for uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        imageName = uuid()+'.jpg'
        cb(null, imageName);
    }
});
console.log(imageName);
const upload = multer({ storage });

app.post("/", async (req, res) => {
    const { name, email } = req.body;
    try {
        const data = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'karamveersachdeva3@gmail.com',
            subject: 'karamveer shana',
            html: `name: ${name} email: ${email}`
        });
        console.log(data);
        res.json("message sent")
    } catch (error) {
        console.log(error);
    }

})

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    const imageUrl = `./uploads/${req.file.filename}`;
    const imagePath = "./uploads/" + imageName;
    
    // Set the appropriate headers
    res.setHeader('Content-Type', 'image/png', 'image/jpg', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename=${imageName}.jpg`);
    
    // Read the image file and stream it to the client for download
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
    res.send(imageUrl);
});

app.get('/download-image', (req, res) => {
    // Generate the image using a library (e.g., Pillow)
    // For simplicity, we will use a pre-existing image as an example.
    const imagePath = "./uploads/" + imageName;

    // Set the appropriate headers
    res.setHeader('Content-Type', 'image/png', 'image/jpg', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename=${imageName}.jpg`);

    // Read the image file and stream it to the client for download
    const imageStream = fs.createReadStream(imagePath);
    imageStream.pipe(res);
});



app.listen(port, () => console.log(`server running on ${port}`))

