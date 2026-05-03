import { Router } from "express";
import { db } from "@workspace/db";
import { wishlistTable, productsTable, categoriesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

function getSessionId(req: any): string {
  const cookieId = req.cookies?.["wishlist_session"];
  if (cookieId) return cookieId;
  const newId = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return newId;
}

// GET /api/wishlist
router.get("/wishlist", async (req, res) => {
  try {
    const sessionId = req.cookies?.["wishlist_session"] || "";
    if (!sessionId) {
      res.json([]);
      return;
    }
    const items = await db
      .select({
        id: wishlistTable.id,
        productId: wishlistTable.productId,
        name: productsTable.name,
        nameAr: productsTable.nameAr,
        price: productsTable.price,
        discountPrice: productsTable.discountPrice,
        images: productsTable.images,
        categoryName: categoriesTable.name,
        categoryNameAr: categoriesTable.nameAr,
        inStock: productsTable.inStock,
      })
      .from(wishlistTable)
      .leftJoin(productsTable, eq(wishlistTable.productId, productsTable.id))
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(wishlistTable.sessionId, sessionId));
    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/wishlist
router.post("/wishlist", async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ error: "productId is required" });
      return;
    }

    let sessionId = req.cookies?.["wishlist_session"];
    if (!sessionId) {
      sessionId = Math.random().toString(36).slice(2) + Date.now().toString(36);
      res.cookie("wishlist_session", sessionId, { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 });
    }

    // Check if already in wishlist
    const [existing] = await db
      .select()
      .from(wishlistTable)
      .where(and(eq(wishlistTable.sessionId, sessionId), eq(wishlistTable.productId, productId)))
      .limit(1);

    if (existing) {
      res.json({ message: "Already in wishlist" });
      return;
    }

    const [item] = await db.insert(wishlistTable).values({ sessionId, productId }).returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/wishlist/:productId
router.delete("/wishlist/:productId", async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const sessionId = req.cookies?.["wishlist_session"] || "";
    if (!sessionId) {
      res.json({ message: "Deleted" });
      return;
    }
    await db.delete(wishlistTable).where(and(eq(wishlistTable.sessionId, sessionId), eq(wishlistTable.productId, productId)));
    res.json({ message: "Deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
