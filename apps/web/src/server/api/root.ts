import { createTRPCRouter } from "~/server/api/trpc";
import { dmmfRouter } from "~/server/api/routers/dmmf";
import { manageSchemaRouter } from "~/server/api/routers/manage-schemas";
import {shareSchemaRouter} from "~/server/api/routers/share-schema";
import {openaiRouter} from "~/server/api/routers/openai";

export const appRouter = createTRPCRouter({
  dmmf: dmmfRouter,
  manageSchema: manageSchemaRouter,
  shareSchema: shareSchemaRouter,
  openai: openaiRouter,
});

export type AppRouter = typeof appRouter;
