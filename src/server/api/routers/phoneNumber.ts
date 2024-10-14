import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { PhoneNumberService } from "../../services/PhoneNumberService";

const phoneNumberService = new PhoneNumberService();

export const phoneNumberRouter = createTRPCRouter({
  createPhoneNumber: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(1),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneNumberService.registerPhoneNumber(
        input.phoneNumber,
        input.password,
      );
    }),

  getPhoneNumberById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await phoneNumberService.getPhoneNumberDetails(input);
    }),

  updatePhoneNumber: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          phoneNumber: z.string().optional(),
          password: z.string().optional(),
          active: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneNumberService.updatePhoneNumber(input.id, input.data);
    }),

  deletePhoneNumber: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await phoneNumberService.deletePhoneNumber(input);
      return { success: true };
    }),

  getAllPhoneNumbers: publicProcedure.query(async () => {
    return await phoneNumberService.getAllPhoneNumbers();
  }),

  authenticatePhoneNumber: publicProcedure
    .input(
      z.object({
        phoneNumber: z.string().min(1),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneNumberService.authenticatePhoneNumber(
        input.phoneNumber,
        input.password,
      );
    }),
});
