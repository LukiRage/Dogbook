const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const cors = require("cors");

//externals routes
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const dogRoute = require("./routes/dog");

const guestRoute = require("./routes/guest");

//routes for select field (admin routes)
const activityRoute = require("./routes/activity");
const mealRoute = require("./routes/meal");
const diseaseRoute = require("./routes/disease");
const breedRoute = require("./routes/breed");

//file uploading
const multer = require("multer");
const path = require("path");

//routes to handle messages
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

//routes to handle events
const eventRoute = require("./routes/event");

//jwt check
const jwt = require("jsonwebtoken");
//VALIDATE JWT (walidacja tokenu z nagłówka jako middleware)
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json("No authorizaton token specified in header");
  }
  jwt.verify(token, process.env.JWT_SERVER_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json("incorrect jwt token");
    }
    req.user = decoded;
    next();
  });
}

dotenv.config();

mongoose.set("strictQuery", false); //deprication warning supress

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connecred to mongo compass");
  }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploaded");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }
    return res.status(200).json({ fileName: file.filename });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute); // dodanie autoryzacji na całej ścieżce: app.use("/api/posts",verifyToken,postRoute);
app.use("/api/dog", dogRoute);

app.use("/api/guest", guestRoute);

//routes for the admins only
app.use("/api/activity", activityRoute);
app.use("/api/meal", mealRoute);
app.use("/api/disease", diseaseRoute);
app.use("/api/breed", breedRoute); //app.use("/api/breed",verifyToken,breedRoute); <<używanie autoryzacji jwt na ścieżce

//routes to handle message communication between users
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.use("/api/event", eventRoute);

//test chronionych zasobów poprzez JWT
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Chronione zasoby" });
});

app.get("/", (req, res) => {
  res.send("home-page");
});

app.listen(8800, () => {
  console.log("Backend server is running!");
});
