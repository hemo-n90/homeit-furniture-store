import { Router } from "express";
import { db } from "@workspace/db";
import { homepageSettingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

// GET /api/homepage
router.get("/homepage", async (req, res) => {
  try {
    const [settings] = await db.select().from(homepageSettingsTable).limit(1);
    res.json(settings || {});
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/homepage
router.patch("/homepage", requireAdmin, async (req, res) => {
  try {
    const fields = ["heroTitle", "heroTitleAr", "heroDescription", "heroDescriptionAr", "heroImage", "announcementBar", "announcementBarAr", "whatsappNumber", "logoUrl"];
    const updates: Record<string, any> = {};
    for (const f of fields) {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    }

    const [existing] = await db.select().from(homepageSettingsTable).limit(1);
    if (existing) {
      const [updated] = await db.update(homepageSettingsTable).set(updates).returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(homepageSettingsTable).values(updates).returning();
      res.json(created);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
