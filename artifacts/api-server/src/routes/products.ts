import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, categoriesTable } from "@workspace/db";
import { eq, and, ilike, desc, asc, sql } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

// GET /api/products
router.get("/products", async (req, res) => {
  try {
    const { categoryId, search, sortBy, featured, onHomepage, isBestseller, limit = 50, offset = 0 } = req.query;

    const conditions: any[] = [];
    if (categoryId) conditions.push(eq(productsTable.categoryId, parseInt(categoryId as string)));
    if (search) conditions.push(ilike(productsTable.nameAr, `%${search}%`));
    if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));
    if (onHomepage === "true") conditions.push(eq(productsTable.isOnHomepage, true));
    if (isBestseller === "true") conditions.push(eq(productsTable.isBestseller, true));

    let orderBy: any = desc(productsTable.createdAt);
    if (sortBy === "price_asc") orderBy = asc(productsTable.price);
    if (sortBy === "price_desc") orderBy = desc(productsTable.price);

    const query = db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        nameAr: productsTable.nameAr,
        description: productsTable.description,
        descriptionAr: productsTable.descriptionAr,
        price: productsTable.price,
        discountPrice: productsTable.discountPrice,
        images: productsTable.images,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        categoryNameAr: categoriesTable.nameAr,
        inStock: productsTable.inStock,
        isFeatured: productsTable.isFeatured,
        isOnHomepage: productsTable.isOnHomepage,
        isBestseller: productsTable.isBestseller,
        badge: productsTable.badge,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id));

    const [countResult] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(productsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const products = conditions.length > 0
      ? await query.where(and(...conditions)).orderBy(orderBy).limit(parseInt(limit as string)).offset(parseInt(offset as string))
      : await query.orderBy(orderBy).limit(parseInt(limit as string)).offset(parseInt(offset as string));

    res.json({ products, total: countResult.total, limit: parseInt(limit as string), offset: parseInt(offset as string) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/products
router.post("/products", requireAdmin, async (req, res) => {
  try {
    const { name, nameAr, description, descriptionAr, price, discountPrice, images, categoryId, inStock, isFeatured, isOnHomepage, isBestseller, badge } = req.body;
    if (!name || !nameAr || !price) {
      res.status(400).json({ error: "name, nameAr, and price are required" });
      return;
    }
    const [product] = await db
      .insert(productsTable)
      .values({ name, nameAr, description, descriptionAr, price: price.toString(), discountPrice: discountPrice ? discountPrice.toString() : null, images: images || [], categoryId: categoryId || null, inStock: inStock !== false, isFeatured: !!isFeatured, isOnHomepage: !!isOnHomepage, isBestseller: !!isBestseller, badge })
      .returning();
    res.status(201).json(product);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/stats/summary
router.get("/products/stats/summary", requireAdmin, async (req, res) => {
  try {
    const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(productsTable);
    const [{ inStock }] = await db.select({ inStock: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.inStock, true));
    const [{ outOfStock }] = await db.select({ outOfStock: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.inStock, false));
    res.json({ total, inStock, outOfStock });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/:id
router.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [product] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        nameAr: productsTable.nameAr,
        description: productsTable.description,
        descriptionAr: productsTable.descriptionAr,
        price: productsTable.price,
        discountPrice: productsTable.discountPrice,
        images: productsTable.images,
        categoryId: productsTable.categoryId,
        categoryName: categoriesTable.name,
        categoryNameAr: categoriesTable.nameAr,
        inStock: productsTable.inStock,
        isFeatured: productsTable.isFeatured,
        isOnHomepage: productsTable.isOnHomepage,
        isBestseller: productsTable.isBestseller,
        badge: productsTable.badge,
        createdAt: productsTable.createdAt,
      })
      .from(productsTable)
      .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/products/:id
router.patch("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: Record<string, any> = {};
    const fields = ["name", "nameAr", "description", "descriptionAr", "price", "discountPrice", "images", "categoryId", "inStock", "isFeatured", "isOnHomepage", "isBestseller", "badge"];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        if (f === "price" || f === "discountPrice") updates[f] = req.body[f] ? req.body[f].toString() : null;
        else updates[f] = req.body[f];
      }
    }
    const [updated] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/products/:id
router.delete("/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
    if (!deleted) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
