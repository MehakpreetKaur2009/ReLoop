import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createProfile, getProfileByUserId, updateProfileByUserId,
  createWasteLog, getWasteLogsByUserId, getWasteLogById, updateWasteLog,
  createPickup, getPendingPickups, getPickupsByTruckUserId, getPickupById, updatePickup, getPickupStats,
  createNotification, getNotificationsByUserId, getUnreadCount, markNotificationRead, markAllNotificationsRead,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ===== Profile =====
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getProfileByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        role: z.enum(["mall", "truck"]),
        mallName: z.string().optional(),
        mallAddress: z.string().optional(),
        loadingDock: z.string().optional(),
        contactPerson: z.string().optional(),
        phoneNumber: z.string().optional(),
        wasteType: z.string().optional(),
        driverName: z.string().optional(),
        truckNumber: z.string().optional(),
        vehicleCapacity: z.string().optional(),
        gpsEnabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await createProfile({
          userId: ctx.user.id,
          ...input,
        });
        // Also update user role
        return { success: true, result };
      }),
    update: protectedProcedure
      .input(z.object({
        mallName: z.string().optional(),
        mallAddress: z.string().optional(),
        loadingDock: z.string().optional(),
        contactPerson: z.string().optional(),
        phoneNumber: z.string().optional(),
        wasteType: z.string().optional(),
        driverName: z.string().optional(),
        truckNumber: z.string().optional(),
        vehicleCapacity: z.string().optional(),
        gpsEnabled: z.boolean().optional(),
        plan: z.enum(["free", "gold", "platinum"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateProfileByUserId(ctx.user.id, input as any);
        return { success: true };
      }),
  }),

  // ===== Waste Logs =====
  wasteLog: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getWasteLogsByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        profileId: z.number(),
        materialType: z.enum(["cardboard", "plastic_wrap", "wooden_pallets"]),
        weightKg: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await createWasteLog({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, result };
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getWasteLogById(input.id);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "matched", "picked_up", "completed"]),
        matchedPickupId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateWasteLog(input.id, {
          status: input.status,
          matchedPickupId: input.matchedPickupId,
        });
        return { success: true };
      }),
  }),

  // ===== Pickups =====
  pickup: router({
    list: protectedProcedure.query(async () => {
      return getPendingPickups();
    }),
    myPickups: protectedProcedure.query(async ({ ctx }) => {
      return getPickupsByTruckUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        wasteLogId: z.number(),
        mallUserId: z.number(),
        mallName: z.string(),
        mallAddress: z.string(),
        loadingDock: z.string().optional(),
        contactPerson: z.string().optional(),
        phoneNumber: z.string().optional(),
        materialType: z.enum(["cardboard", "plastic_wrap", "wooden_pallets"]),
        weightKg: z.number(),
        detourKm: z.number().optional(),
        fuelAllowance: z.number().optional(),
        distanceToMall: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await createPickup({
          ...input,
          detourKm: input.detourKm ?? 0,
          fuelAllowance: input.fuelAllowance ?? 0,
          distanceToMall: input.distanceToMall ?? 0,
        });
        // Create notification for truck users
        // In a real system this would broadcast to nearby trucks
        return { success: true, result };
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getPickupById(input.id);
      }),
    accept: protectedProcedure
      .input(z.object({ pickupId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await updatePickup(input.pickupId, {
          truckUserId: ctx.user.id,
          status: "accepted",
        });
        return { success: true };
      }),
    complete: protectedProcedure
      .input(z.object({ pickupId: z.number() }))
      .mutation(async ({ input }) => {
        await updatePickup(input.pickupId, { status: "completed" });
        // Also update the waste log
        const pickup = await getPickupById(input.pickupId);
        if (pickup) {
          await updateWasteLog(pickup.wasteLogId, { status: "completed", matchedPickupId: pickup.id });
        }
        return { success: true };
      }),
    stats: protectedProcedure.query(async () => {
      return getPickupStats();
    }),
  }),

  // ===== Notifications =====
  notification: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getNotificationsByUserId(ctx.user.id);
    }),
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return getUnreadCount(ctx.user.id);
    }),
    markRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await markNotificationRead(input.id);
        return { success: true };
      }),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
      await markAllNotificationsRead(ctx.user.id);
      return { success: true };
    }),
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["pickup_request", "pickup_accepted", "pickup_completed", "plan_expiring", "system", "esg_update"]),
        title: z.string(),
        message: z.string(),
        relatedPickupId: z.number().optional(),
        relatedWasteLogId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await createNotification({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true, result };
      }),
  }),
});

export type AppRouter = typeof appRouter;
