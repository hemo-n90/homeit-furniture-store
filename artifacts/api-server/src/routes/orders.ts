import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq, desc, sql, and } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

// GET /api/orders
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const conditions: any[] = [];
    if (status) conditions.push(eq(ordersTable.status, status as string));

    const orders = conditions.length > 0
      ? await db.select().from(ordersTable).where(and(...conditions)).orderBy(desc(ordersTable.createdAt)).limit(parseInt(limit as string)).offset(parseInt(offset as string))
      : await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(parseInt(limit as string)).offset(parseInt(offset as string));

    res.json(orders);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/orders
router.post("/orders", async (req, res) => {
  try {
    const { customerName, customerPhone, city, address, notes, paymentMethod, items } = req.body;
    if (!customerName || !customerPhone || !city || !address || !items?.length) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Fetch products to get current prices
    const productIds = items.map((i: any) => i.productId);
    const products = await db.select().from(productsTable).where(
      sql`${productsTable.id} = ANY(${sql.raw(`ARRAY[${productIds.join(",")}]::int[]`)})`,
    );

    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        res.status(400).json({ error: `Product ${item.productId} not found` });
        return;
      }
      const unitPrice = parseFloat(product.discountPrice || product.price);
      const qty = parseInt(item.quantity);
      const total = unitPrice * qty;
      totalAmount += total;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        productNameAr: product.nameAr,
        productImage: (product.images as string[])?.[0] || null,
        quantity: qty,
        unitPrice: unitPrice.toFixed(2),
        totalPrice: total.toFixed(2),
      });
    }

    const [order] = await db
      .insert(ordersTable)
      .values({ customerName, customerPhone, city, address, notes, paymentMethod: paymentMethod || "cod", status: "new", totalAmount: totalAmount.toFixed(2) })
      .returning();

    const insertedItems = await db
      .insert(orderItemsTable)
      .values(orderItems.map((item) => ({ ...item, orderId: order.id })))
      .returning();

    res.status(201).json({ ...order, items: insertedItems });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders/stats/summary
router.get("/orders/stats/summary", requireAdmin, async (req, res) => {
  try {
    const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(ordersTable);
    const [{ newOrders }] = await db.select({ newOrders: sql<number>`count(*)::int` }).from(ordersTable).where(eq(ordersTable.status, "new"));
    const [{ revenue }] = await db.select({ revenue: sql<string>`COALESCE(sum(total_amount), 0)::text` }).from(ordersTable).where(eq(ordersTable.status, "completed"));
    res.json({ total, newOrders, revenue: parseFloat(revenue) });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders/:id
router.get("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    res.json({ ...order, items });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/orders/:id/status
router.patch("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    if (!status) {
      res.status(400).json({ error: "status is required" });
      return;
    }
    const [updated] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
