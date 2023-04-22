import { Frequency, SharingOptions } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
});
