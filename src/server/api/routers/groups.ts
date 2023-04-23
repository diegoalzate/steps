import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          description: input.description,
        },
      });
      await ctx.prisma.group_User.create({
        data: {
          userId,
          groupId: group.id,
          role: "ADMIN",
        },
      });
      return group;
    }),
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
      where: {
        groupUsers: {
          some: {
            userId: ctx.userId,
          },
        },
      },
    });
  }),
  getOne: privateProcedure
    .input(z.optional(z.string()))
    .query(({ ctx, input }) => {
      return ctx.prisma.group.findFirst({
        where: {
          id: input,
        },
      });
    }),
});
