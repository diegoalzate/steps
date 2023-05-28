import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const habitEntriesRouter = createTRPCRouter({
  getEntries: privateProcedure
    .input(
      z.object({
        habitId: z.string(),
        createdAfterDate: z.optional(z.string()),
      })
    )
    .query(({ ctx, input }) => {
      const { habitId, createdAfterDate } = input;
      const userId = ctx.userId;
      return ctx.prisma.habitEntry.findMany({
        where: {
          userId,
          habitId,
          created_at: {
            gt: createdAfterDate,
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });
    }),
  create: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const habitId = input;
      const userId = ctx.userId;

      const habit = await ctx.prisma.habit.findUnique({
        where: {
          id: habitId,
        },
      });

      if (habit?.userId === userId) {
        const habitEntry = await ctx.prisma.habitEntry.create({
          data: {
            habitId,
            userId,
          },
        });
        return habitEntry;
      } else if (habit?.groupId) {
        // check if this is a group habit
        // and user is part of group
        const isUserPartOfGroup = await ctx.prisma.group_User.findFirst({
          where: {
            groupId: habit.groupId,
            userId: userId,
          },
        });

        if (isUserPartOfGroup) {
          const habitEntry = await ctx.prisma.habitEntry.create({
            data: {
              habitId,
              userId,
            },
          });
          return habitEntry;
        }
      }

      // user did not create habit and is not part of a group that did
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }),
});
