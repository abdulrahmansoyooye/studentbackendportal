import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import helmet from "helmet";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import idCardRoutes from "./routes/IdCard.js";
import { requestIdCard } from "./controllers/IdCard.js";
import { mockUsers } from "./data/mockdata.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =======================
   ✅ GLOBAL MIDDLEWARES
======================= */

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(helmet());

// 🔥 IMPORTANT: Allow cross-origin properly
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

/* =======================
   ✅ CORS CONFIG
======================= */

const allowedOrigins = [
  "https://studentidmanagement.vercel.app",
  "https://adminmanagement.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors());

/* =======================
   STATIC FILES
======================= */

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* =======================
   FILE UPLOAD
======================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/assets/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

/* =======================
   ROUTES
======================= */

app.use("/idcard", upload.single("qrcodeFile"), idCardRoutes);
app.post("/request/:id", requestIdCard);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

/* =======================
   SERVER STARTUP
======================= */

const PORT = process.env.PORT || 6001;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");

    // 🔐 Hash shared password once
    const sharedPassword = mockUsers[0].password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(sharedPassword, salt);

    const usersToInsert = mockUsers.map((user) => ({
      ...user,
      password: hashedPassword,
    }));

    const existingUsers = await User.countDocuments();
    if (existingUsers === 0) {
      await User.insertMany(usersToInsert);
      console.log("👥 Mock users inserted");
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Startup error:", err.message);
    process.exit(1);
  }
};

startServer();
