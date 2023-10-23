import {} from 'dotenv/config'
import express from "express";
import cors from "cors";
import sendEmail from "./email.js";

const PORT = process.env.PORT || 3434;
const ALLOWED_ADDRESSES = process.env.CLIENT_ADDRESS;
const server = express();

server.use(cors({
    origin: (origin, callback) => {
            if(ALLOWED_ADDRESSES === origin || !origin){
                callback(null, true);
            }
            else callback(new Error('Invalid address'));
    },
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 204,
}))
server.use(express.json());

server.post('/sendemail', async (req, res) => {
    if(!req.body.name || !req.body.phone) return res.status(404).send('Please enter valid data');
    try{
        await sendEmail(req.body.name, req.body.phone);
        res.status(200).send('Email sent successfully')
    } catch(err) {
        console.log(err);
        res.status(404).send('Email not sent');
    }
})

server.listen(PORT, (err)=> !err && console.log(`Server started on port ${PORT}`));
