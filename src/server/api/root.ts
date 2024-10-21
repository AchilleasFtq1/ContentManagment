import { appRoute } from "~/server/api/routers/app"; // Import phoneNumber router
import { contentRouter } from "~/server/api/routers/content"; // Import content router
import { phoneAppRelRouter } from "~/server/api/routers/phoneAppRel"; // Import phoneAppRel router
import { phoneGroupUrlRouter } from "~/server/api/routers/phoneGroupUrl"; // Import phoneGroupUrl router
import { phoneNumberRouter } from "~/server/api/routers/phoneNumber"; // Import phoneNumber router
import { productRouter } from "~/server/api/routers/product"; // Import product router
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "./routers/post";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postRouter,
  content: contentRouter, // Add content router
  phoneNumber: phoneNumberRouter, // Add phoneNumber router
  phoneAppRel: phoneAppRelRouter, // Add phoneAppRel router
  phoneGroupUrl: phoneGroupUrlRouter, // Add phoneGroupUrl router
  product: productRouter, // Add product router
  app: appRoute,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
