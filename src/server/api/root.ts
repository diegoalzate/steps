import { createTRPCRouter } from "~/server/api/trpc";
import { habitsRouter } from "./routers/habits";
import { habitEntriesRouter } from "./routers/habitEntries";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  habits: habitsRouter,
  habitEntries: habitEntriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
