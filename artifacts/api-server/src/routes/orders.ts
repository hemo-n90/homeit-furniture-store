import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq, desc, and, inArray, count, sum } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";

import { parseOrderItems, boundedText, toHundredths, formatHundredths } from "../lib/order-input";

const router = Router();

// GET /api/orders
router.get("/orders", requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    const limitN = Math.max(1, Math.min(parseInt(limit as string) || 50, 200));
    const offsetN = Math.max(0, parseInt(offset as string) || 0);

    const conditions = [];
    if (status) conditions.push(eq(ordersTable.status, status as string));

    const base = conditions.length > 0
      ? db.select().from(ordersTable).where(and(...conditions))
      : db.select().from(ordersTable);

    const orders = await base.orderBy(desc(ordersTable.createdAt)).limit(limitN).offset(offsetN);

    const [{ total }] = await db.select({ total: count() }).from(ordersTable);

    res.json({ orders, total });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/orders
router.post("/orders", async (req, res) => {
  try {
    const { customerName, customerPhone, city, address, notes, paymentMethod, items } = req.body;
    const parsedItems = parseOrderItems(items);
    if (!boundedText(customerName, 255) || !boundedText(customerPhone, 50) ||
        !boundedText(city, 100) || !boundedText(address, 2000) || !parsedItems ||
        (notes != null && (typeof notes !== "string" || notes.length > 2000)) ||
        (paymentMethod != null && paymentMethod !== "cod")) {
      res.status(400).json({ error: "Invalid order fields or items" });
      return;
    }
    const productIds = parsedItems.map(item => item.productId);

    const products = await db
      .select()
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));

    let totalAmount = 0;
    const orderItems: {
      productId: number;
      productName: string;
      productNameAr: string;
      productImage: string | null;
      quantity: number;
      unitPrice: string;
      totalPrice: string;
    }[] = [];

    for (const item of parsedItems) {
      const pid = item.productId;
      const product = products.find((p) => p.id === pid);
      if (!product || !product.inStock) {
        res.status(400).json({ error: `Product ${item.productId} not found` });
        return;
      }
      // Integer hundredths avoid floating-point drift in money totals.
      const unitHundredths = toHundredths(String(product.discountPrice || product.price));
      const qty = item.quantity;
      if (unitHundredths === null || unitHundredths * qty >= 10000000000) {
        res.status(400).json({ error: "Invalid product price or order total" });
        return;
      }
      const lineHundredths = unitHundredths * qty;
      totalAmount += lineHundredths;
      orderItems.push({
        productId: product.id,
        productName: product.name,
        productNameAr: product.nameAr,
        productImage: (product.images as string[])?.[0] ?? null,
        quantity: qty,
        unitPrice: formatHundredths(unitHundredths),
        totalPrice: formatHundredths(lineHundredths),
      });
    }

    if (totalAmount >= 10000000000) {
      res.status(400).json({ error: "Order total exceeds supported range" });
      return;
    }
    const result = await db.transaction(async (tx) => {
      const [order] = await tx.insert(ordersTable).values({
        customerName: customerName.trim(), customerPhone: customerPhone.trim(),
        city: city.trim(), address: address.trim(), notes: notes || null,
        paymentMethod: "cod", status: "new", totalAmount: formatHundredths(totalAmount),
      }).returning();
      const insertedItems = await tx.insert(orderItemsTable)
        .values(orderItems.map(item => ({ ...item, orderId: order.id }))).returning();
      return { ...order, items: insertedItems };
    });

    res.status(201).json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders/stats/summary
router.get("/orders/stats/summary", requireAdmin, async (req, res) => {
  try {
    const [{ totalOrders }] = await db
      .select({ totalOrders: count() })
      .from(ordersTable);

    const [{ totalRevenue }] = await db
      .select({ totalRevenue: sum(ordersTable.totalAmount) })
      .from(ordersTable);

    const byStatusRaw = await db
      .select({ status: ordersTable.status, count: count() })
      .from(ordersTable)
      .groupBy(ordersTable.status);

    const byStatus = byStatusRaw.map((row) => ({
      status: row.status,
      count: row.count,
    }));

    const recentOrders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt))
      .limit(5);

    res.json({
      totalOrders,
      totalRevenue: parseFloat(totalRevenue ?? "0"),
      byStatus,
      recentOrders,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders/:id
router.get("/orders/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, id))
      .limit(1);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, id));
    res.json({ ...order, items });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/orders/:id/status
router.patch("/orders/:id/status", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid order ID" });
      return;
    }
    const { status } = req.body;
    const validStatuses = ["new", "processing", "shipped", "completed", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const [updated] = await db
      .update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, id))
      .returning();
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

