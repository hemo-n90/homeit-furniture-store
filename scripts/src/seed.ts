import { db, pool } from "@workspace/db";
import {
  usersTable,
  categoriesTable,
  productsTable,
  homepageSettingsTable,
  ordersTable,
  orderItemsTable,
} from "@workspace/db";
import bcrypt from "bcrypt";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const passwordHash = await bcrypt.hash("admin123456", 10);
  await db
    .insert(usersTable)
    .values({
      email: "admin@homeitfurniture.com",
      password: passwordHash,
      name: "مدير النظام",
      role: "admin",
    })
    .onConflictDoNothing();
  console.log("✓ Admin user created");

  // Create categories
  const categories = await db
    .insert(categoriesTable)
    .values([
      {
        name: "Majlis Seating",
        nameAr: "مجالس",
        slug: "majalis",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      },
      {
        name: "Sofas & Couches",
        nameAr: "كنبات وأرائك",
        slug: "sofas",
        image:
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      },
      {
        name: "Curtains & Drapes",
        nameAr: "ستائر وأقمشة",
        slug: "curtains",
        image:
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
      },
      {
        name: "Home Decor",
        nameAr: "ديكور المنزل",
        slug: "decor",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      },
    ])
    .onConflictDoNothing()
    .returning();

  console.log(`✓ ${categories.length} categories created`);

  // Re-fetch categories to get IDs
  const allCategories = await db.select().from(categoriesTable);
  const majalisId = allCategories.find((c) => c.slug === "majalis")?.id ?? 1;
  const sofasId = allCategories.find((c) => c.slug === "sofas")?.id ?? 2;
  const curtainsId = allCategories.find((c) => c.slug === "curtains")?.id ?? 3;
  const decorId = allCategories.find((c) => c.slug === "decor")?.id ?? 4;

  // Create products
  const productCount = await db.select().from(productsTable);
  if (productCount.length === 0) {
    await db.insert(productsTable).values([
      {
        name: "Royal Arabic Majlis Set",
        nameAr: "طقم مجلس عربي ملكي",
        description: "A luxurious Arabic-style majlis set with premium fabric and golden trimmings. Perfect for grand reception rooms.",
        descriptionAr: "طقم مجلس عربي فاخر من القماش الفاخر مع تشطيبات ذهبية. مثالي لغرف الاستقبال الكبيرة.",
        price: "8500.00",
        discountPrice: "7200.00",
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
          "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
        ],
        categoryId: majalisId,
        inStock: true,
        isFeatured: true,
        isOnHomepage: true,
        isBestseller: true,
        badge: "bestseller",
      },
      {
        name: "Classic Majlis Corner Set",
        nameAr: "مجلس ركني كلاسيكي",
        description: "Elegant corner majlis with hand-carved wooden details and plush velvet cushions.",
        descriptionAr: "مجلس ركني أنيق مع تفاصيل خشبية منحوتة يدوياً ووسائد من المخمل الفاخر.",
        price: "6200.00",
        images: [
          "https://images.unsplash.com/photo-1567016520496-0cb37d8467a7?w=800&q=80",
        ],
        categoryId: majalisId,
        inStock: true,
        isFeatured: true,
        isOnHomepage: true,
        isBestseller: false,
        badge: "new",
      },
      {
        name: "Modern Luxury Sofa",
        nameAr: "كنبة فاخرة عصرية",
        description: "Contemporary 3-seater sofa in premium Italian leather with chrome accents.",
        descriptionAr: "كنبة عصرية ثلاثية المقاعد من الجلد الإيطالي الفاخر مع لمسات كروم.",
        price: "4800.00",
        discountPrice: "3990.00",
        images: [
          "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        ],
        categoryId: sofasId,
        inStock: true,
        isFeatured: true,
        isOnHomepage: true,
        isBestseller: true,
        badge: "discount",
      },
      {
        name: "Velvet Chesterfield Sofa",
        nameAr: "أريكة تشيسترفيلد المخملية",
        description: "Classic Chesterfield design in royal blue velvet with button tufting.",
        descriptionAr: "تصميم تشيسترفيلد الكلاسيكي بالمخمل الأزرق الملكي مع تفاصيل الأزرار.",
        price: "5500.00",
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        ],
        categoryId: sofasId,
        inStock: true,
        isFeatured: false,
        isOnHomepage: false,
        isBestseller: false,
        badge: null,
      },
      {
        name: "Gold Silk Curtains",
        nameAr: "ستائر حريرية ذهبية",
        description: "Luxurious floor-to-ceiling silk curtains with gold embroidery.",
        descriptionAr: "ستائر حريرية فاخرة من الأرض للسقف مع تطريز ذهبي.",
        price: "1800.00",
        discountPrice: "1450.00",
        images: [
          "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
        ],
        categoryId: curtainsId,
        inStock: true,
        isFeatured: true,
        isOnHomepage: true,
        isBestseller: false,
        badge: "discount",
      },
      {
        name: "Royal Velvet Curtains",
        nameAr: "ستائر مخملية ملكية",
        description: "Deep burgundy velvet curtains with gold tassels, sold per pair.",
        descriptionAr: "ستائر مخملية بلون البرغندي الغامق مع شراريب ذهبية، تباع زوجاً.",
        price: "2200.00",
        images: [
          "https://images.unsplash.com/photo-1558882224-dda166733046?w=800&q=80",
        ],
        categoryId: curtainsId,
        inStock: true,
        isFeatured: false,
        isOnHomepage: false,
        isBestseller: true,
        badge: "bestseller",
      },
      {
        name: "Arabian Nights Vase Set",
        nameAr: "طقم مزهريات ليالي عربية",
        description: "Hand-painted ceramic vase set inspired by traditional Arabic geometric patterns.",
        descriptionAr: "طقم مزهريات سيراميك مرسومة يدوياً مستوحاة من الأنماط الهندسية العربية التقليدية.",
        price: "650.00",
        images: [
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        ],
        categoryId: decorId,
        inStock: true,
        isFeatured: false,
        isOnHomepage: true,
        isBestseller: false,
        badge: "new",
      },
      {
        name: "Luxury Floor Lamp",
        nameAr: "مصباح أرضي فاخر",
        description: "Moroccan-style floor lamp with brass finish and intricate cutwork shade.",
        descriptionAr: "مصباح أرضي بتصميم مغربي مع تشطيب نحاسي وظل مشغول بشكل معقد.",
        price: "980.00",
        discountPrice: "799.00",
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
        ],
        categoryId: decorId,
        inStock: true,
        isFeatured: true,
        isOnHomepage: false,
        isBestseller: false,
        badge: "discount",
      },
    ]);
    console.log("✓ Products created");
  } else {
    console.log("✓ Products already exist, skipping");
  }

  // Homepage settings
  const existing = await db.select().from(homepageSettingsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(homepageSettingsTable).values({
      heroTitle: "Homeit Furniture — Premium Home Décor",
      heroTitleAr: "هوميت للأثاث — أثاث منزلي فاخر",
      heroDescription: "Crafting bespoke luxury furniture for discerning homes",
      heroDescriptionAr: "نصنع أثاثاً فاخراً راقياً للمنازل الراقية — حيث يلتقي الأصالة بالحداثة",
      heroImage:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=90",
      announcementBar: "Free delivery on orders above SAR 2000 | Call us: +966 50 000 0000",
      announcementBarAr: "توصيل مجاني للطلبات فوق 2000 ريال | اتصل بنا: 0500000000",
      whatsappNumber: "966500000000",
    });
    console.log("✓ Homepage settings created");
  }

  // Demo orders
  const orderCount = await db.select().from(ordersTable);
  if (orderCount.length === 0) {
    const allProducts = await db.select().from(productsTable).limit(3);
    if (allProducts.length >= 2) {
      const [order] = await db
        .insert(ordersTable)
        .values({
          customerName: "أحمد محمد الغامدي",
          customerPhone: "0501234567",
          city: "الرياض",
          address: "حي النزهة، شارع الأمير محمد بن عبدالعزيز",
          notes: "يرجى التواصل قبل التوصيل",
          paymentMethod: "cod",
          status: "new",
          totalAmount: (parseFloat(allProducts[0].price) + parseFloat(allProducts[1].price)).toFixed(2),
        })
        .returning();

      await db.insert(orderItemsTable).values([
        {
          orderId: order.id,
          productId: allProducts[0].id,
          productName: allProducts[0].name,
          productNameAr: allProducts[0].nameAr,
          productImage: (allProducts[0].images as string[])?.[0] || null,
          quantity: 1,
          unitPrice: allProducts[0].price,
          totalPrice: allProducts[0].price,
        },
        {
          orderId: order.id,
          productId: allProducts[1].id,
          productName: allProducts[1].name,
          productNameAr: allProducts[1].nameAr,
          productImage: (allProducts[1].images as string[])?.[0] || null,
          quantity: 1,
          unitPrice: allProducts[1].price,
          totalPrice: allProducts[1].price,
        },
      ]);

      await db
        .insert(ordersTable)
        .values({
          customerName: "سارة العمري",
          customerPhone: "0559876543",
          city: "جدة",
          address: "حي الروضة، شارع التحلية",
          paymentMethod: "cod",
          status: "completed",
          totalAmount: allProducts[2].price,
        });

      console.log("✓ Demo orders created");
    }
  }

  console.log("✅ Database seeded successfully!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
