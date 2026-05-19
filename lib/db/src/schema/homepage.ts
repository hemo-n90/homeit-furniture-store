import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const homepageSettingsTable = pgTable("homepage_settings", {
  id: serial("id").primaryKey(),
  heroTitle: varchar("hero_title", { length: 500 }),
  heroTitleAr: varchar("hero_title_ar", { length: 500 }),
  heroDescription: text("hero_description"),
  heroDescriptionAr: text("hero_description_ar"),
  heroImage: text("hero_image"),
  announcementBar: varchar("announcement_bar", { length: 500 }),
  announcementBarAr: varchar("announcement_bar_ar", { length: 500 }),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }),
  logoUrl: text("logo_url"),
});

export const insertHomepageSettingsSchema = createInsertSchema(homepageSettingsTable).omit({ id: true });
export type InsertHomepageSettings = z.infer<typeof insertHomepageSettingsSchema>;
export type HomepageSettings = typeof homepageSettingsTable.$inferSelect;
