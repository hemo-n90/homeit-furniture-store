import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("نوع الملف غير مدعوم. يرجى رفع صورة (JPEG, PNG, WebP)"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// POST /api/upload — upload one or more images
router.post("/upload", requireAdmin, upload.array("images", 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ error: "لم يتم رفع أي ملف" });
      return;
    }
    const host = `${req.protocol}://${req.get("host")}`;
    const urls = files.map(f => `${host}/api/uploads/${f.filename}`);
    res.json({ urls });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "فشل رفع الملف" });
  }
});

export default router;
