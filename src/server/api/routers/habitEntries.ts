import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const habitEntriesRouter = createTRPCRouter({
  getEntries: privateProcedure.input(z.string()).query(({ ctx, input }) => {
    const habitId = input;
    const userId = ctx.userId;
    return ctx.prisma.habitEntry.findMany({
      where: {
        habit: {
          userId,
        },
        habitId,
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

      if (habit?.userId !== userId)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const habitEntry = await ctx.prisma.habitEntry.create({
        data: {
          habitId,
        },
      });

      return habitEntry;
    }),
});
