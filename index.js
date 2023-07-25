require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const { Resend } = require('resend');
const cors = require("cors");
const resend = new Resend(process.env.RESEND_DKEY);
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

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

app.listen(port, () => console.log(`server running on ${port}`))

