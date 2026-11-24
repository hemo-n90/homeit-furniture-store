import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { productsTable } from "./products";

export const wishlistTable = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  productId: integer("product_id").references(() => productsTable.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWishlistSchema = createInsertSchema(wishlistTable).omit({ id: true, createdAt: true });
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlistTable.$inferSelect;
