import { createTRPCRouter } from "~/server/api/trpc";
import { dmmfRouter } from "~/server/api/routers/dmmf";
import { manageSchemaRouter } from "~/server/api/routers/manage-schemas";

export const appRouter = createTRPCRouter({
  dmmf: dmmfRouter,
  manageSchema: manageSchemaRouter,
});

export type AppRouter = typeof appRouter;
