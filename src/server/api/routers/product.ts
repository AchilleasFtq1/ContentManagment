import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { ProductService } from "../../services/ProductService";

const productService = new ProductService();

export const productRouter = createTRPCRouter({
  createProduct: protectedProcedure
    .input(
      z.object({
        productName: z.string().min(1),
        appId: z.string(),
        active: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await productService.createProduct(input.productName, input.appId);
    }),

  getProductsByAppId: protectedProcedure
    .input(z.object({ appId: z.string() })) // Accepts appId as input
    .query(async ({ input }) => {
      return await productService.getProductsByAppId(input.appId); // Calls the service to fetch products by appId
    }),
  getProductById: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => {
      return await productService.getProductDetails(input.productId);
    }),

  getAllProducts: protectedProcedure.query(async () => {
    return await productService.getAllProducts();
  }),

  updateProduct: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          productName: z.string().optional(),
          active: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return await productService.updateProduct(input.id, input.data);
    }),

  deleteProduct: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ input }) => {
      await productService.deleteProduct(input.productId);
      return { success: true };
    }),
});
