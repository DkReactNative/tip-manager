import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import UserRoute from "./routes/user.route";
import TipRoute from "./routes/tip.route";

dotenv.config()
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to tip manager application." });
});

app.use('/user',UserRoute);
app.use('/user',TipRoute);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

