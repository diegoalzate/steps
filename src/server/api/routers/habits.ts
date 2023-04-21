import { Frequency, SharingOptions } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const habitsRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    const userId = ctx.userId;

    return ctx.prisma.habit.findMany({
      where: {
        userId,
      },
    });
  }),
  getOne: privateProcedure.input(z.string()).query(({ ctx, input }) => {
    const userId = ctx.userId;

    return ctx.prisma.habit.findFirst({
      where: {
        userId,
        id: input,
      },
    });
  }),
  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const habit = await ctx.prisma.habit.findUnique({
        where: {
          id: input,
        },
      });

      if (userId !== habit?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return ctx.prisma.habit.delete({
        where: {
          id: input,
        },
      });
    }),
  create: privateProcedure
    .input(
      z.object({
        task: z.string(),
        amount: z.number(),
        frequency: z.nativeEnum(Frequency),
        sharingOptions: z.nativeEnum(SharingOptions),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { amount, frequency, sharingOptions, task } = input;
      const userId = ctx.userId;
      const habit = ctx.prisma.habit.create({
        data: {
          task,
          amount,
          frequency,
          sharingOptions,
          userId,
        },
      });

      return habit;
    }),
});
