import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const groupUsersRouter = createTRPCRouter({
  getOne: privateProcedure
    .input(z.optional(z.string()))
    .query(({ ctx, input }) => {
      return ctx.prisma.group_User.findFirst({
        where: {
          groupId: input,
          userId: ctx.userId,
        },
      });
    }),
  create: privateProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.group_User.create({
      data: {
        role: "USER",
        userId: ctx.userId,
        groupId: input,
      },
    });
  }),
  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const groupUser = await ctx.prisma.group_User.findFirst({
        where: {
          groupId: input,
          userId: ctx.userId,
        },
      });

      if (!groupUser) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // leave group if user is not admin
      if (groupUser?.role !== "ADMIN") {
        await ctx.prisma.group_User.delete({
          where: {
            id: groupUser?.id,
          },
        });

        return true;
      }

      // delete group if user is admin
      await ctx.prisma.group.delete({
        where: {
          id: input,
        },
      });

      return true;
    }),
});
