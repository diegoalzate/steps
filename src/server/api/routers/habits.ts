import { Frequency, SharingOptions } from "@prisma/client";
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
