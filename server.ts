import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { AIManager } from "./src/server/ai/manager";

const app = express();
const PORT = 3000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api", limiter);

// Streaming upload to disk to avoid large memory footprints
const upload = multer({ dest: os.tmpdir() });

const publicFiles = new Map<string, string>();
const aiManager = new AIManager();

// Expose temporary endpoint for providers to download the file directly from our server
app.get("/public-temp/:id", (req, res) => {
  const filePath = publicFiles.get(req.params.id);
  if (filePath) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Not found");
  }
});

function getPublicUrl(req: express.Request, id: string) {
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/public-temp/${id}`;
}

app.post("/api/enhance/image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileId = uuidv4();
    publicFiles.set(fileId, req.file.path);
    
    // Automatically delete after 1 hour (giving AI time to download)
    setTimeout(() => {
      publicFiles.delete(fileId);
      fs.promises.unlink(req.file!.path).catch(() => {});
    }, 60 * 60 * 1000);

    const scale = parseInt(req.body.scale || "2", 10);
    const faceEnhance = req.body.faceEnhance === "true";

    const output = await aiManager.enhanceImage(
      req.file.path, 
      req.file.mimetype, 
      { scale, faceEnhance },
      (filePath) => getPublicUrl(req, fileId)
    );

    res.json({ output });
  } catch (error: any) {
    console.error("Enhance Image Error:", error);
    res.status(500).json({ error: error.message || "Failed to process image" });
  }
});

app.post("/api/enhance/video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileId = uuidv4();
    publicFiles.set(fileId, req.file.path);
    
    setTimeout(() => {
      publicFiles.delete(fileId);
      fs.promises.unlink(req.file!.path).catch(() => {});
    }, 60 * 60 * 1000);

    const output = await aiManager.enhanceVideo(
      req.file.path, 
      req.file.mimetype,
      (filePath) => getPublicUrl(req, fileId)
    );

    res.json({ output });
  } catch (error: any) {
    console.error("Enhance Video Error:", error);
    res.status(500).json({ error: error.message || "Failed to process video" });
  }
});

app.post("/api/contact", async (req, res) => {
  res.json({ success: true, message: "Message received." });
});

app.get("/api/stats", async (req, res) => {
  res.json({ providers: aiManager.getProviderStats() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
