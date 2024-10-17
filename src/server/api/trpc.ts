import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import { PhoneNumberService } from "../services/PhoneNumberService";

const phoneNumberService = new PhoneNumberService();

/**
 * 1. CONTEXT
 *
 * Defines the context available in the backend API. It includes the database and session.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession();

  return {
    db,
    session,
    headers: opts.headers, // Pass headers for potential use
  };
};

/**
 * 2. INITIALIZATION
 *
 * Initializes tRPC with the context and a custom error formatter to handle Zod validation errors.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. PROCEDURES
 *
 * - `publicProcedure`: Used for routes that do not require authentication.
 * - `protectedProcedure`: Used for routes that require an authenticated user.
 */

// Middleware for adding timing to all procedures (can be removed if not needed)
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  const end = Date.now();
  console.log(`[tRPC] ${path} took ${end - start}ms`);
  return result;
});

// Public procedure: No authentication required
export const publicProcedure = t.procedure.use(timingMiddleware);

// Protected procedure: Requires authentication
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

/**
 * 4. OPENAPI SETUP
 *
 * Initialize OpenAPI tRPC setup (OpenAPI routes can be added separately).
 */
export const openApiT = initTRPC
  .meta()
  .context<typeof createTRPCContext>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

/**
 * Custom Authentication Middleware for OpenAPI Routes
 * Validates the incoming token from headers.
 */
/**
 * Custom Authentication Middleware for OpenAPI Routes
 * Validates the incoming token from headers.
 */
export const openApiAuthMiddleware = openApiT.middleware(
  async ({ ctx, next }) => {
    const authHeader = ctx.headers.get("authorization"); // Token in the Authorization header

    if (!authHeader) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Missing authorization header",
      });
    }

    // Assuming the token is in the format 'Bearer <token>'
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid authorization header format",
      });
    }

    const token = tokenParts[1]!; // Assert that token is not undefined

    try {
      await phoneNumberService.validateToken(token);
    } catch (error) {
      console.error("Token validation error:", error);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
    }

    // Continue to the next middleware or resolver if authenticated
    return next({
      ctx: {
        ...ctx,
        user: ctx.session?.user,
      },
    });
  },
);
/**
 * 5. ROUTER EXPORTS
 *
 * Export tRPC and OpenAPI router creation utilities.
 * - `createTRPCRouter` is for regular tRPC routes.
 * - `createOpenApiRouter` is for OpenAPI routes with OpenAPI middleware applied.
 */
export const createTRPCRouter = t.router;
export const createOpenApiRouter = openApiT.router;
