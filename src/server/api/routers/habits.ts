import { Frequency, SharingOptions } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const habitsRouter = createTRPCRouter({
  getAll: privateProcedure
    .input(z.optional(z.string()))
    .query(({ ctx, input }) => {
      if (input) {
        return ctx.prisma.habit.findMany({
          where: {
            groupId: input,
          },
        });
      } else {
        const userId = ctx.userId;
        return ctx.prisma.habit.findMany({
          where: {
            userId,
            groupId: {
              equals: null,
            },
          },
        });
      }
    }),
  getOne: privateProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userId = ctx.userId;

    const habit = await ctx.prisma.habit.findFirst({
      where: {
        id: input,
      },
    });

    if (habit?.userId === userId) {
      return habit;
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
        return habit;
      }
    }

    // user did not create habit and is not part of a group that did
    throw new TRPCError({ code: "UNAUTHORIZED" });
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
        groupId: z.nullable(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { amount, frequency, sharingOptions, task, groupId } = input;
      const userId = ctx.userId;
      const habit = ctx.prisma.habit.create({
        data: {
          task,
          amount,
          frequency,
          sharingOptions,
          userId,
          groupId,
        },
      });

      return habit;
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        frequency: z.nativeEnum(Frequency),
        sharingOptions: z.nativeEnum(SharingOptions),
        amount: z.number(),
        groupId: z.string().nullable(),
        task: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const habit = await ctx.prisma.habit.findUnique({
        where: {
          id: input.id,
        },
      });

      if (userId !== habit?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const updatedHabit = await ctx.prisma.habit.update({
        where: {
          id: input.id,
        },
        data: {
          ...habit,
          frequency: input.frequency,
          amount: input.amount,
          task: input.task,
          sharingOptions: input.sharingOptions,
        },
      });

      return updatedHabit;
    }),
});
