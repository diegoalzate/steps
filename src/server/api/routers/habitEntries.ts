import { Frequency, HabitEntry } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import dayjs, { ManipulateType, OpUnitType } from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

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
  getStreak: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const habit = await ctx.prisma.habit.findUnique({
        where: {
          id: input,
        },
      });

      const habitEntries = await ctx.prisma.habitEntry.findMany({
        where: {
          userId,
          habitId: input,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      const calculateStreak = (
        habitEntries: HabitEntry[],
        frequency: Frequency
      ) => {
        // a completed habit is a goal that is done in specific time
        let completedHabits = 0;
        const now = dayjs();
        let firstDate = now
          .startOf(frequency.toLowerCase() as OpUnitType)
          .subtract(1, frequency.toLowerCase() as ManipulateType);
        let lastDate = now
          .endOf(frequency.toLowerCase() as OpUnitType)
          .subtract(1, frequency.toLowerCase() as ManipulateType);
        const goalAmountOfHabits = habit?.amount;
        let habitEntriesInTimeRange = 0;
        for (const entry of habitEntries ?? []) {
          const entryDate = dayjs(entry.created_at);

          if (entryDate.isBefore(firstDate)) {
            break;
          }

          const entryDateIsInRange =
            entryDate.isAfter(firstDate) && entryDate.isBefore(lastDate);

          console.log({ firstDate, lastDate, entryDate, entryDateIsInRange });

          if (entryDateIsInRange) {
            habitEntriesInTimeRange += 1;
          }

          console.log(
            "reached goal?",
            habitEntriesInTimeRange === goalAmountOfHabits
          );
          if (habitEntriesInTimeRange === goalAmountOfHabits) {
            // reset
            habitEntriesInTimeRange = 0;
            firstDate = firstDate.subtract(
              1,
              frequency.toLowerCase() as ManipulateType
            );
            lastDate = lastDate.subtract(
              1,
              frequency.toLowerCase() as ManipulateType
            );
            completedHabits += 1;
          }
        }
        return completedHabits;
      };

      if (!habit?.frequency || !habitEntries) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const streak = calculateStreak(habitEntries, habit?.frequency);
      return streak;
    }),
});
