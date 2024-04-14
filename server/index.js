import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

//! always import and call dotenv, dont just access process variables before that...
import dotenv from "dotenv";

const app = express();
dotenv.config();

// * app.get('/', (req, res) => {
// *     res.send('Hello');
// * })

//setting up the response and request limits

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
//adding prefix to all routes in posts.js, which is imo a good thing to do for organising....
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

//setting up the database

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false);
