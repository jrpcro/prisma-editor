import { type Permission } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import {createTRPCRouter, protectedProcedure, publicProcedure} from "~/server/api/trpc";
import { readFile, writeFile } from "fs";
import { promisify } from "util";

export const manageSchemaRouter = createTRPCRouter({
  createSchema: protectedProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.create({
        data: {
          title: input.title,
          user: { connect: { id: session?.user.id } },
        },
        select: { id: true },
      });
      return schema.id;
    }),
  getSchema: publicProcedure
    .input(
      z.object({
        id: z.number(),
        token: z.string().optional(),
      })
    )
    .query(async () => {
      const read = promisify(readFile);
      const path = `${process.cwd()}/temp.prisma`;
      const file = await read(path);
      const schema = {
        schema: file.toString(),
        userId: 1,
      };

      return { schema: schema?.schema || "", permission: 'UPDATE' as Permission };
    }),
  getSchemas: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    const schemas = await prisma.schema.findMany({
      where: {
        OR: [
          { user: { id: { equals: session?.user.id } } },
          { shareSchema: { sharedUsers: { some: { id: session?.user.id } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        schema: true,
        updatedAt: true,
        userId: true,
      },
    });

    return schemas;
  }),
  updateSchema: publicProcedure
    .input(
      z.object({
        id: z.number(),
        schema: string(),
      })
    )
    .mutation(async ({ input }) => {
      const write = promisify(writeFile);
      const path = `${process.cwd()}/temp.prisma`;

      await write(path, input.schema);

      return true;
    }),
  deleteSchema: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.findUnique({
        where: { id: input.id },
        select: {
          userId: true,
          shareSchema: { select: { sharedUsers: { select: { id: true } } } },
        },
      });

      const isOwner = schema?.userId === session.user.id;
      const isSchemaSharedWith = schema?.shareSchema?.sharedUsers
        .map((u) => u.id)
        .includes(session.user.id);

      if (!isOwner && !isSchemaSharedWith) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      } else if (isSchemaSharedWith) {
        await prisma.shareSchema.update({
          where: {
            schemaId: input.id,
          },
          data: {
            sharedUsers: {
              disconnect: {
                id: session.user.id,
              },
            },
          },
        });
        return true;
      }

      await prisma.schema.delete({
        where: { id: input.id },
      });
      return true;
    }),
});
