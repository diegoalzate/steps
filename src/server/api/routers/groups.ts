import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";

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
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
      where: {
        groupUsers: {
          some: {
            userId: ctx.userId,
          },
        },
      },
    });
  }),
  getOne: privateProcedure
    .input(z.optional(z.string()))
    .query(({ ctx, input }) => {
      return ctx.prisma.group.findFirst({
        where: {
          id: input,
        },
      });
    }),
  getLeaderboard: privateProcedure
    .input(
      z.object({
        groupId: z.string(),
        createdAfterDate: z.optional(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const partOfGroup = await ctx.prisma.group.findMany({
        where: {
          id: input.groupId,
        },
      });

      if (!partOfGroup) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const habits = await ctx.prisma.habit.findMany({
        where: {
          groupId: input.groupId,
        },
      });

      const habitIds = habits.map((habit) => habit.id);

      const habitEntries = await ctx.prisma.habitEntry.findMany({
        where: {
          habitId: {
            in: habitIds,
          },
          created_at: {
            gt: input.createdAfterDate,
          },
        },
      });

      const leaderboard: { [userId: string]: number } = {}; // {userId: score}};

      for (const entry of habitEntries) {
        if (entry.userId) {
          leaderboard[entry.userId] = (leaderboard[entry.userId] ?? 0) + 1;
        }
      }

      const leaderboardWithUsername: { [username: string]: number } = {}; // {username: score}};

      const users = await clerkClient.users.getUserList({
        userId: Object.keys(leaderboard),
      });

      for (const userId in leaderboard) {
        const user = users.find((user) => userId === user.id);
        if (user) {
          leaderboardWithUsername[user.username ?? "anonymous"] =
            leaderboard[userId] ?? 0;
        }
      }
      return leaderboardWithUsername;
    }),
});
