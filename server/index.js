

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// Components
import Connection from "./database/db.js";
import Router from "./routes/route.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Catch-all route to handle client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8000;
const username = process.env.DB_USERNAME || "user";
const password = process.env.DB_PASSWORD || "user";

Connection(username, password);

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);
