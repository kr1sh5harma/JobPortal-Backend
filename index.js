import dns from 'node:dns';
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// Force Google DNS to resolve MongoDB Atlas SRV records
// (local DNS may not support SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4']);
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: [
    "https://job-portal-frontend-kappa-two.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running", success: true });
});

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Connect to DB first, then start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();