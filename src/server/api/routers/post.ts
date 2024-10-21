import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { PostService } from "../../services/PostService";

const postService = new PostService();

export const postRouter = createTRPCRouter({
  // Route for creating a post
  createPost: protectedProcedure
    .input(
      z.object({
        phoneNumberId: z.string().uuid(), // UUID validation
        contentId: z.string().uuid(),
        appId: z.string().uuid(),
        productId: z.string().uuid(),
        status: z.boolean().optional().default(false),
        failReason: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await postService.createPost(
        input.phoneNumberId,
        input.contentId,
        input.appId,
        input.productId,
        input.status,
        input.failReason,
      );
    }),

  // Route for getting post details by ID
  getPostById: protectedProcedure
    .input(z.object({ id: z.string().uuid() })) // Validate UUID
    .query(async ({ input }) => {
      return await postService.getPostDetails(input.id);
    }),

  // Route for getting all posts
  getAllPosts: protectedProcedure.query(async () => {
    return await postService.getAllPosts();
  }),

  // Route for updating a post
  updatePost: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        data: z.record(z.string(), z.unknown()), // Flexible data object
      }),
    )
    .mutation(async ({ input }) => {
      return await postService.updatePost(input.id, input.data);
    }),

  // Route for deleting a post
  deletePost: protectedProcedure
    .input(z.object({ id: z.string().uuid() })) // Validate UUID
    .mutation(async ({ input }) => {
      return await postService.deletePost(input.id);
    }),

  // Route for updating post status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.boolean(),
        failReason: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await postService.updateStatus(
        input.id,
        input.status,
        input.failReason,
      );
    }),

  // Route for fetching post history with filters
  getPostHistory: protectedProcedure
    .input(
      z.object({
        content_uuid: z.string().uuid().optional(),
        media_uuid: z.string().uuid().optional(),
        phone_uuid: z.string().uuid().optional(),
        from_date: z.date().optional(),
        end_date: z.date().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await postService.getHistory(input);
    }),

  // Route for finding posts by social media platform (app) UUID
  findBySocialMediaUuid: protectedProcedure
    .input(z.object({ social_media_uuid: z.string().uuid() })) // Validate UUID
    .query(async ({ input }) => {
      return await postService.findBySocialMediaUuid(input.social_media_uuid);
    }),

  // Route for getting all post logs
  getAllPostLogs: protectedProcedure.query(async () => {
    return await postService.getAllPostLogs();
  }),

  // Route for getting post log history with filters
  getPostLogHistory: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid().optional(),
        userId: z.string().uuid().optional(),
        requestIp: z.string().optional(),
        from_date: z.date().optional(),
        end_date: z.date().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await postService.getPostLogHistory(input);
    }),
});
