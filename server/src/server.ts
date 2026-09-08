import express from "express";
import cors from "cors";

import surveyRoutes from "./routes/survey";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
    res.json({ message: "API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

