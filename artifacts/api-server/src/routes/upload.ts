import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "node:crypto";
import { requireAdmin } from "../middlewares/auth";
import { imageExtension } from "../lib/upload-type";

const router = Router();
const uploadDir = path.join(process.cwd(), "uploads");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 10 } });

router.post("/upload", requireAdmin, upload.array("images", 10), async (req, res) => {
  const written: string[] = [];
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return res.status(400).json({ error: "لم يتم رفع أي ملف" });
    const extensions = files.map(file => imageExtension(file.buffer));
    if (extensions.some(ext => ext === null)) {
      return res.status(400).json({ error: "Unsupported image content" });
    }
    await fs.mkdir(uploadDir, { recursive: true });
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const filename = `${randomUUID()}.${extensions[i]}`;
      const target = path.join(uploadDir, filename);
      await fs.writeFile(target, files[i].buffer, { flag: "wx" });
      written.push(target);
      urls.push(`/api/uploads/${filename}`);
    }
    return res.json({ urls });
  } catch (err) {
    await Promise.allSettled(written.map(file => fs.unlink(file)));
    req.log.error(err);
    return res.status(500).json({ error: "فشل رفع الملف" });
  }
});

export default router;
