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
});
