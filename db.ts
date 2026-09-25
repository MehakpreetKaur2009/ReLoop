import { and, eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, wasteLogs, pickups, notifications, InsertProfile, InsertWasteLog, InsertPickup, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ====== Profile Queries ======

export async function createProfile(data: InsertProfile) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(profiles).values(data);
  return result;
}

export async function getProfileByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateProfile(id: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(profiles).set(data as any).where(eq(profiles.id, id));
}

export async function updateProfileByUserId(userId: number, data: Partial<InsertProfile>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(profiles).set(data as any).where(eq(profiles.userId, userId));
}

// ====== Waste Log Queries ======

export async function createWasteLog(data: InsertWasteLog) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(wasteLogs).values(data);
  return result;
}

export async function getWasteLogsByUserId(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(wasteLogs)
    .where(eq(wasteLogs.userId, userId))
    .orderBy(desc(wasteLogs.createdAt))
    .limit(limit);
}

export async function getWasteLogById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(wasteLogs).where(eq(wasteLogs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateWasteLog(id: number, data: Partial<InsertWasteLog>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(wasteLogs).set(data as any).where(eq(wasteLogs.id, id));
}

// ====== Pickup Queries ======

export async function createPickup(data: InsertPickup) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(pickups).values(data);
  return result;
}

export async function getPendingPickups(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pickups)
    .where(eq(pickups.status, "pending"))
    .orderBy(desc(pickups.createdAt))
    .limit(limit);
}

export async function getPickupsByTruckUserId(truckUserId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pickups)
    .where(and(eq(pickups.truckUserId, truckUserId), eq(pickups.status, "accepted")))
    .orderBy(desc(pickups.createdAt))
    .limit(limit);
}

export async function getPickupById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(pickups).where(eq(pickups.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updatePickup(id: number, data: Partial<InsertPickup>) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(pickups).set(data as any).where(eq(pickups.id, id));
}

export async function getPickupStats() {
  const db = await getDb();
  if (!db) return { total: 0, completed: 0, pending: 0 };
  const all = await db.select().from(pickups);
  return {
    total: all.length,
    completed: all.filter(p => p.status === "completed").length,
    pending: all.filter(p => p.status === "pending").length,
  };
}

// ====== Notification Queries ======

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(notifications).values(data);
  return result;
}

export async function getNotificationsByUserId(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  return result[0]?.count ?? 0;
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
}
