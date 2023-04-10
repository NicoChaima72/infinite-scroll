import { z } from "zod";
import { faker } from "@faker-js/faker";
import { createTRPCRouter, publicProcedure } from "y/server/api/trpc";

export const postsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const posts = await ctx.prisma.post.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextPost = posts.pop();
        nextCursor = nextPost?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  add: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        author: z.string(),
        authorImage: z.string(),
        id: z.string(),
        createdAt: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          author: input.author,
          authorImage: input.authorImage,
        },
      });

      return post;
    }),
});
