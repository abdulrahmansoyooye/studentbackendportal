import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import bcrypt from "bcrypt"
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import idCardRoutes from "./routes/IdCard.js";
import { verifyToken } from "./middlewares/auth.js";

import { requestIdCard  } from "./controllers/IdCard.js";
import { mockUsers } from "./data/mockdata.js";
import User from "./models/User.js";
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
app.use(cors({
   origin: ["https://studentidmanagement.vercel.app","http://localhost:3000","http://adminmanagement.vercel.app/"], // your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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
app.use("/idcard", upload.single("qrcodeFile"), idCardRoutes);

app.post("/request/:id", requestIdCard);
// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
// MOGOOSE SETUP
const PORT = process.env.PORT || 6001;
const startServer = async () => {
  try {
    // 🔌 Connect to database
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // 🔐 Hash the shared password ONCE
    const sharedPassword = mockUsers[0].password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sharedPassword, salt);

    // 🌱 Prepare users with hashed password
    const usersToInsert = mockUsers.map((user) => ({
      ...user,
      password: hashedPassword,
    }));

    // ❗ Avoid duplicate insert (matric numbers must be unique)
    const existing = await User.countDocuments();

    if (existing === 0) {
      await User.insertMany(usersToInsert);
      console.log("👥 Mock users inserted successfully");
    } else {
      console.log("⚠️ Users already exist, skipping insert.");
    }

    // ▶️ Start the server AFTER database operations are done
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup Error:", err.message);
    process.exit(1);
  }
};

// Run the startup function
startServer();