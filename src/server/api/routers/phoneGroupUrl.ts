import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PhoneGroupUrlService } from "../../services/PhoneGroupUrlService";

const phoneGroupUrlService = new PhoneGroupUrlService();

export const phoneGroupUrlRouter = createTRPCRouter({
  // Create a new PhoneGroupUrl
  createPhoneGroupUrl: protectedProcedure
    .input(
      z.object({
        phoneGroupId: z.string(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneGroupUrlService.createPhoneGroupUrl(
        input.phoneGroupId,
        input.url,
      );
    }),

  // Get all PhoneGroupUrls
  getAllPhoneGroupUrls: protectedProcedure.query(async () => {
    return await phoneGroupUrlService.getAllPhoneGroupUrls();
  }),

  // Get a PhoneGroupUrl by ID
  getPhoneGroupUrlById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await phoneGroupUrlService.getPhoneGroupUrlById(input.id);
    }),

  // Update a PhoneGroupUrl
  updatePhoneGroupUrl: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.record(z.unknown()), // Accepts a record with unknown fields
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneGroupUrlService.updatePhoneGroupUrl(
        input.id,
        input.data,
      );
    }),

  // Delete a PhoneGroupUrl
  deletePhoneGroupUrl: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneGroupUrlService.deletePhoneGroupUrl(input.id);
    }),
});
