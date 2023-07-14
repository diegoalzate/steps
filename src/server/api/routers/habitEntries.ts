import { type Frequency, type HabitEntry } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { type ManipulateType, type OpUnitType } from "dayjs";
import dayjs from "~/utils/dayjs";

export const habitEntriesRouter = createTRPCRouter({
  getAll: privateProcedure
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
  getOne: privateProcedure.input(z.string()).query(({ ctx, input }) => {
    const id = input;
    return ctx.prisma.habitEntry.findUnique({
      where: {
        id,
      },
    });
  }),
  delete: privateProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;
      const habitEntryId = input;

      const habitEntry = await ctx.prisma.habitEntry.findFirst({
        where: {
          id: habitEntryId,
          userId,
        },
      });

      if (!habitEntry) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const deleteHabitEntry = await ctx.prisma.habitEntry.delete({
        where: {
          id: habitEntryId,
        },
      });

      return deleteHabitEntry;
    }),
  create: privateProcedure
    .input(
      z.object({
        habitId: z.string(),
        description: z.string().optional(),
        feeling: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { habitId, description, feeling } = input;
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
            description,
            feeling,
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
              description,
              feeling,
            },
          });
          return habitEntry;
        }
      }

      // user did not create habit and is not part of a group that did
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().optional().nullable(),
        feeling: z.number().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const habitEntry = await ctx.prisma.habitEntry.findUnique({
        where: {
          id: input.id,
        },
      });

      if (userId !== habitEntry?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const updatedHabitEntry = await ctx.prisma.habitEntry.update({
        where: {
          id: input.id,
        },
        data: {
          ...habitEntry,
          description: input.description,
          feeling: input.feeling,
        },
      });

      return updatedHabitEntry;
    }),
  /**
   * Function to calculate the streak of completed habits for a given user.
   *
   * @input - The ID of the habit for which the streak is to be calculated
   *
   * @returns - The streak of the habit (number of consecutive completions)
   *
   * This function fetches the relevant Habit and HabitEntry records from the database,
   * then calculates the streak based on the frequency of the habit and the timestamps of the HabitEntry records.
   *
   * Throws an error if the habit doesn't exist or the user is unauthorized.
   *
   * The streak is calculated by iterating over the HabitEntry records, checking if each habit completion occurred within the habit's frequency.
   * Each time a completion is found within the frequency, the streak counter is incremented.
   * If a completion is found that did not occur within the frequency, the counter is reset.
   *
   * Note that the streak calculation is performed on demand, i.e., it is not stored in the database and is recalculated each time this function is called.
   */
  getStreak: privateProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const habit = await ctx.prisma.habit.findUnique({
        where: {
          id: input,
        },
      });

      if (!habit)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Habit not found.",
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

      if (habitEntries.length === 0)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No habit entries found.",
        });

      const calculateStreak = (
        habitEntries: HabitEntry[],
        frequency: Frequency
      ) => {
        let completedHabits = 0;
        const now = dayjs();
        let firstDate = now
          .startOf(frequency.toLowerCase() as OpUnitType)
          .subtract(1, frequency.toLowerCase() as ManipulateType);
        let lastDate = now
          .endOf(frequency.toLowerCase() as OpUnitType)
          .subtract(1, frequency.toLowerCase() as ManipulateType)
          .add(12, "hours"); // add a 12-hour grace period
        let habitEntriesInTimeRange = 0;
        for (const entry of habitEntries) {
          const entryDate = dayjs(entry.created_at);

          if (entryDate.isBefore(firstDate)) break;

          if (entryDate.isAfter(firstDate) && entryDate.isBefore(lastDate)) {
            habitEntriesInTimeRange += 1;

            if (habitEntriesInTimeRange === habit.amount) {
              // reset
              habitEntriesInTimeRange = 0;
              completedHabits += 1;
              firstDate = firstDate.subtract(
                1,
                frequency.toLowerCase() as ManipulateType
              );
              lastDate = lastDate
                .subtract(1, frequency.toLowerCase() as ManipulateType)
                .add(12, "hours"); // adjust the next period with the grace period
            }
          }
        }

        return completedHabits;
      };

      const streak = calculateStreak(habitEntries, habit.frequency);
      return streak;
    }),
});
