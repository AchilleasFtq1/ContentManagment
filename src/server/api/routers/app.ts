import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AppService } from "../../services/AppService";

const appService = new AppService();

export const appRouter = createTRPCRouter({
  createApp: protectedProcedure
    .input(
      z.object({
        appName: z.string().min(1),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await appService.createApp(input.appName);
    }),

  getAppById: protectedProcedure
    .input(z.object({ appId: z.string() }))
    .query(async ({ input }) => {
      return await appService.getAppDetails(input.appId);
    }),

  getAllApps: protectedProcedure.query(async () => {
    return await appService.getAllApps();
  }),

  updateApp: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          appName: z.string().optional(),
          active: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return await appService.updateApp(input.id, input.data);
    }),

  deleteApp: protectedProcedure
    .input(z.object({ appId: z.string() }))
    .mutation(async ({ input }) => {
      await appService.deleteApp(input.appId);
      return { success: true };
    }),
});
