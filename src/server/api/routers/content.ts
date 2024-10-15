import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ContentService } from "../../services/ContentService";

const contentService = new ContentService();

export const contentRouter = createTRPCRouter({
  createContent: protectedProcedure
    .input(
      z.object({
        contentName: z.string().min(1),
        productIds: z.array(z.string()),
        appIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      return await contentService.createContent(
        input.contentName,
        input.productIds,
        input.appIds,
      );
    }),

  deleteContent: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await contentService.deleteContent(input);
      return { success: true };
    }),

  updateContent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          contentName: z.string().optional(),
          productIds: z.array(z.string()).optional(),
          appIds: z.array(z.string()).optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return await contentService.updateContent(input.id, input.data);
    }),

  getAllContents: protectedProcedure.query(async () => {
    return await contentService.getAllContents();
  }),

  getContentById: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await contentService.getContentById(input);
    }),
});
