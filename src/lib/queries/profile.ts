import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db";
import { items, orders, packageItems, packages } from "@/db/schema";
import { authenticationMiddleware } from "@/middleware/auth";
import { setResponseHeader } from "@tanstack/react-start/server";

export const getProfile = createServerFn({ method: "GET" })
  .middleware([authenticationMiddleware])
  .handler(async ({ context }) => {
    const userId = context.userId;

    if (!userId) {
      throw new Error("User ID not found in context");
    }

    const userOrdersCount = await db.$count(
      orders,
      and(eq(orders.userId, userId), isNull(orders.deletedAt)),
    );

    setResponseHeader("content-type", "appliation/json");
    return {
      id: context.userId,
      name: context.name || "",
      email: context.email || "",
      phone: context.phone || "",
      avatarUrl: context.avatarUrl || null,
      totalBookings: userOrdersCount,
    };
  });

export const getUserBookings = createServerFn({ method: "GET" })
  .middleware([authenticationMiddleware])
  .handler(async ({ context }) => {
    console.log(
      "[getUserBookings] Fetching bookings for user:",
      context.userId,
    );
    const userId = context.userId;

    if (!userId) {
      throw new Error("User ID not found in context");
    }

    const userOrders = await db.query.orders.findMany({
      where: and(eq(orders.userId, userId), isNull(orders.deletedAt)),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    });

    console.log(
      `[getUserBookings] Found ${userOrders.length} orders for user ${userId}`,
    );

    if (userOrders.length === 0) {
      return [];
    }
    console.log("[getUserBookings] User orders:", userOrders);

    const packageIds = [...new Set(userOrders.map((order) => order.packageId))];
    const packagesData = await db.query.packages.findMany({
      where: inArray(packages.id, packageIds),
    });

    const packagesMap = new Map(
      packagesData.map((pkg) => [
        pkg.id,
        {
          id: pkg.id,
          name: pkg.title || "",
          price: pkg.price || 0,
        },
      ]),
    );
    console.log("[getUserBookings] Packages Map:", packagesMap);

    const bookings = userOrders
      .map((order) => {
        const pkg = packagesMap.get(order.packageId);

        let status: "upcoming" | "completed" | "cancelled" = "upcoming";
        if (order.status === "completed") {
          status = "completed";
        } else if (order.status === "cancelled") {
          status = "cancelled";
        } else if (order.status === "paid" || order.status === "in_progress") {
          status = "upcoming";
        }

        let videoLink: "view" | "pending" | undefined;
        let videoCount: number | undefined;

        if (status === "completed") {
          videoLink = "view";
          videoCount = 1;
        } else if (status === "upcoming") {
          videoLink = "pending";
        }

        const date = order.createdAt
          ? order.createdAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          : "";

        return {
          id: order.id,
          name: pkg?.name || "Unknown Package",
          recurring:
            order.frequency === "monthly" || order.frequency === "weekly",
          date,
          status,
          videoLink,
          videoCount,
          contribution: pkg?.price ?? 0,
        };
      })
      .filter((booking) => booking.date !== "");
    setResponseHeader("content-type", "appliation/json");
    return bookings;
  });

export const getBookingDetails = createServerFn({ method: "GET" })
  .middleware([authenticationMiddleware])
  .inputValidator((data: { orderId: string }) => data)
  .handler(async ({ context, data }) => {
    const userId = context.userId;

    if (!userId) {
      throw new Error("User ID not found in context");
    }

    const order = await db.query.orders.findFirst({
      where: and(
        eq(orders.id, data.orderId),
        eq(orders.userId, userId),
        isNull(orders.deletedAt),
      ),
    });

    if (!order) {
      throw new Error("Order not found or access denied");
    }

    const pkg = await db.query.packages.findFirst({
      where: eq(packages.id, order.packageId),
    });

    const pkgItems = await db.query.packageItems.findMany({
      where: eq(packageItems.packageId, order.packageId),
    });

    const itemIds = pkgItems
      .map((pi) => pi.itemId)
      .filter((id): id is string => id !== null && id !== undefined);

    const itemsData =
      itemIds.length > 0
        ? await db.query.items.findMany({
          where: inArray(items.id, itemIds),
        })
        : [];

    const itemsMap = new Map(
      itemsData.map((item) => [
        item.id,
        {
          id: item.id,
          name: item.title || "",
          price: item.price != null ? Number(item.price) : 0,
          description: item.description || "",
        },
      ]),
    );

    const packageItemsWithDetails = pkgItems
      .map((pi) => {
        const item = itemsMap.get(pi.itemId as string);
        return item
          ? {
            id: item.id,
            name: item.name,
            quantity: pi.quantity || 1,
            price: item.price,
            description: item.description,
          }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    let status: "upcoming" | "completed" | "cancelled" = "upcoming";
    if (order.status === "completed") {
      status = "completed";
    } else if (order.status === "cancelled") {
      status = "cancelled";
    } else if (order.status === "paid" || order.status === "in_progress") {
      status = "upcoming";
    }

    const date = order.createdAt
      ? order.createdAt.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        weekday: "long",
      })
      : "";

    const frequency = order.frequency || "one-time";

    return {
      id: order.id,
      packageName: pkg?.title || "Unknown Package",
      packageDescription: pkg?.description || "",
      status,
      date,
      frequency,
      contribution: pkg?.price ?? 0,
      qrToken: order.qrToken || null,
      startDate: order.startDate
        ? order.startDate.toLocaleDateString("en-IN")
        : null,
      endDate: order.endDate ? order.endDate.toLocaleDateString("en-IN") : null,
      items: packageItemsWithDetails,
      videoLink:
        status === "completed"
          ? "view"
          : status === "upcoming"
            ? "pending"
            : null,
      videoCount: status === "completed" ? 1 : undefined,
    };
  });
