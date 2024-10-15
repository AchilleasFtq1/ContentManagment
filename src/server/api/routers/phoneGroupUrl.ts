import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PhoneAppRelService } from "../../services/PhoneAppRelService";

const phoneAppRelService = new PhoneAppRelService();

export const phoneAppRelRouter = createTRPCRouter({
  createPhoneAppRel: protectedProcedure
    .input(z.object({ phoneId: z.string(), appId: z.string() }))
    .mutation(async ({ input }) => {
      return await phoneAppRelService.createPhoneAppRel(
        input.phoneId,
        input.appId,
      );
    }),

  getAllPhoneAppRels: protectedProcedure.query(async () => {
    return await phoneAppRelService.getAllPhoneAppRels();
  }),

  getPhoneAppRelById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await phoneAppRelService.getPhoneAppRelById(input.id);
    }),

  updatePhoneAppRel: protectedProcedure
    .input(z.object({ id: z.string(), data: z.record(z.unknown()) }))
    .mutation(async ({ input }) => {
      return await phoneAppRelService.updatePhoneAppRel(input.id, input.data);
    }),

  deletePhoneAppRel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await phoneAppRelService.deletePhoneAppRel(input.id);
    }),
});
