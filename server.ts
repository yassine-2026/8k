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
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/health", async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    
    // Check storage availability
    let storageStatus = "ok";
    try {
      const testFile = path.join(os.tmpdir(), `health_test_${Date.now()}.txt`);
      await fs.promises.writeFile(testFile, "test");
      await fs.promises.unlink(testFile);
    } catch (e) {
      storageStatus = "failed";
    }

    // Check environment variables for providers
    const envStatus = {
      replicate: !!process.env.REPLICATE_API_TOKEN,
      fal: !!process.env.FAL_KEY,
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
      deepai: !!process.env.DEEPAI_API_KEY,
      clipdrop: !!process.env.CLIPDROP_API_KEY,
    };

    // Fast check if at least one provider has keys
    const hasProviders = Object.values(envStatus).some(val => val === true);

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      server: {
        uptime: process.uptime(),
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        }
      },
      storage: storageStatus,
      environment: envStatus,
      ai_providers_configured: hasProviders
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

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

    // Clean up file immediately after processing is complete
    publicFiles.delete(fileId);
    fs.promises.unlink(req.file.path).catch(() => {});

    res.json({ output });
  } catch (error: any) {
    console.error("Enhance Image Error:", error);
    if (req.file) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
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

    // Clean up file immediately after processing is complete
    publicFiles.delete(fileId);
    fs.promises.unlink(req.file.path).catch(() => {});

    res.json({ output });
  } catch (error: any) {
    console.error("Enhance Video Error:", error);
    if (req.file) {
      fs.promises.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ error: error.message || "Failed to process video" });
  }
});

app.post("/api/contact", async (req, res) => {
  res.json({ success: true, message: "Message received." });
});

app.get("/api/stats", async (req, res) => {
  res.json({ providers: aiManager.getProviderStats() });
});

app.get("/api/health", async (req, res) => {
  try {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
    const results = await aiManager.testProviders(baseUrl);
    
    if (req.accepts('html')) {
      let html = '<html><head><title>Health Check</title><style>body{font-family:sans-serif;background:#0f172a;color:#fff;padding:2rem}table{width:100%;border-collapse:collapse;margin-top:1rem}th,td{padding:0.75rem;border-bottom:1px solid #334155;text-align:left}.working{color:#4ade80}.inactive{color:#94a3b8}.failed{color:#f87171}</style></head><body>';
      html += '<h1>API Providers Health Status</h1><table><tr><th>Provider</th><th>Status</th><th>Latency</th><th>Reason</th></tr>';
      for (const r of results) {
        html += `<tr class="${r.status}"><td>${r.provider}</td><td>${r.status}</td><td>${r.latencyMs ? r.latencyMs+'ms' : '-'}</td><td>${r.reason || '-'}</td></tr>`;
      }
      html += '</table></body></html>';
      return res.send(html);
    }
    
    res.json({ status: "ok", results });
  } catch (error: any) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
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

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
