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
        active: z.boolean().default(true), // 'active' field with a default value
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneNumberService.registerPhoneNumber(
        input.phoneNumber,
        input.password,
        input.active,
      );
    }),

  getPhoneNumberById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return await phoneNumberService.getPhoneNumberDetails(input);
    }),

  updatePhoneNumberActiveStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        active: z.boolean(), // Only updating the 'active' field
      }),
    )
    .mutation(async ({ input }) => {
      return await phoneNumberService.updatePhoneNumberActiveStatus(
        input.id,
        input.active,
      );
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
