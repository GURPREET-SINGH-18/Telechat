const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');


const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const conversationRoute = require('./routes/conversations');
const messageRoute = require('./routes/messages');

dotenv.config();

app.use("/images",express.static(path.join(__dirname,"public/images")))

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected!")
}).catch(err => {
    console.log(err)
});

//middleware
app.use(express.json());
app.use(helmet());
// app.use(multer());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/images")
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name)
        // cb(null,file.originalname)
    }
});
const upload=multer({storage:storage});
app.post("/api/upload", upload.single("file"),(req,res)=>{
    try {
        return res.status(200).json("File uploaded successfully")
    } catch (err) {
        console.log(err);
    }
})

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


app.listen(8800, () => {
    console.log('Backend is running at http://127.0.0.1:8800')
})