import { boolean, double, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "mall", "truck"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profiles with role-specific fields.
 */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["mall", "truck"]).notNull(),
  // Mall fields
  mallName: text("mallName"),
  mallAddress: text("mallAddress"),
  loadingDock: text("loadingDock"),
  contactPerson: text("contactPerson"),
  phoneNumber: text("phoneNumber"),
  wasteType: text("wasteType"),
  // Truck fields
  driverName: text("driverName"),
  truckNumber: text("truckNumber"),
  vehicleCapacity: text("vehicleCapacity"),
  gpsEnabled: boolean("gpsEnabled").default(false),
  // Plan
  plan: mysqlEnum("plan", ["free", "gold", "platinum"]).default("free").notNull(),
  planDaysLeft: int("planDaysLeft").default(10),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * Waste logs submitted by mall/retail users.
 */
export const wasteLogs = mysqlTable("waste_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  profileId: int("profileId").notNull(),
  materialType: mysqlEnum("materialType", ["cardboard", "plastic_wrap", "wooden_pallets"]).notNull(),
  weightKg: double("weightKg").notNull(),
  status: mysqlEnum("status", ["pending", "matched", "picked_up", "completed"]).default("pending").notNull(),
  matchedPickupId: int("matchedPickupId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WasteLog = typeof wasteLogs.$inferSelect;
export type InsertWasteLog = typeof wasteLogs.$inferInsert;

/**
 * Pickup requests managed by the system.
 */
export const pickups = mysqlTable("pickups", {
  id: int("id").autoincrement().primaryKey(),
  wasteLogId: int("wasteLogId").notNull(),
  mallUserId: int("mallUserId").notNull(),
  truckUserId: int("truckUserId"),
  mallName: text("mallName").notNull(),
  mallAddress: text("mallAddress").notNull(),
  loadingDock: text("loadingDock"),
  contactPerson: text("contactPerson"),
  phoneNumber: text("phoneNumber"),
  materialType: mysqlEnum("materialType", ["cardboard", "plastic_wrap", "wooden_pallets"]).notNull(),
  weightKg: double("weightKg").notNull(),
  detourKm: double("detourKm").default(0),
  fuelAllowance: double("fuelAllowance").default(0),
  status: mysqlEnum("status", ["pending", "accepted", "in_progress", "completed", "declined"]).default("pending").notNull(),
  distanceToMall: double("distanceToMall").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pickup = typeof pickups.$inferSelect;
export type InsertPickup = typeof pickups.$inferInsert;

/**
 * Notifications for bell icon.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["pickup_request", "pickup_accepted", "pickup_completed", "plan_expiring", "system", "esg_update"]).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  relatedPickupId: int("relatedPickupId"),
  relatedWasteLogId: int("relatedWasteLogId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;