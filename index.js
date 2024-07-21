import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import idCardRoutes from "./routes/IdCard.js";
import { verifyToken } from "./middlewares/auth.js";

import { createIdCard } from "./controllers/IdCard.js";
// CONFIGURATIONS
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(cors());

// File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route with files
app.post("/auth/register", upload.single("photoFile"), register);
app.use("/idcard", upload.single("qrcodeFile"), idCardRoutes);

app.post("/createId", createIdCard);
// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// MOGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((err) => {
    console.log(`${err}`);
  });
