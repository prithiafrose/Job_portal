import express from "express";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing basic imports...");

const app = express();
console.log("Express imported successfully");

app.use(express.json());
app.use(cors());

console.log("Basic setup completed");