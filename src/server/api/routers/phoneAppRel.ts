import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PhoneAppRelService } from "../../services/PhoneAppRelService";

const phoneAppRelService = new PhoneAppRelService();

export const phoneAppRelRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ phoneId: z.string(), appId: z.string() }))
    .mutation(async ({ input }) => {
      return phoneAppRelService.createPhoneAppRel(input.phoneId, input.appId);
    }),

  getAll: protectedProcedure.query(async () => {
    return phoneAppRelService.getAllPhoneAppRels();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return phoneAppRelService.getPhoneAppRelById(input.id);
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), data: z.record(z.string(), z.any()) }))
    .mutation(async ({ input }) => {
      return phoneAppRelService.updatePhoneAppRel(input.id, input.data);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return phoneAppRelService.deletePhoneAppRel(input.id);
    }),
});
