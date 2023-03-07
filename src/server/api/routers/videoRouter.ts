import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const videoRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.video.findMany();
  }),
  createOne: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ctx, input }) => {
      return ctx.prisma.video.create({
        data: {
          title: input.title,
          status: 'Available',
          rentedBy: '',
          returnDate: ''
        }
      });
    }),
  updateOne: publicProcedure
    .input(z.object({id: z.string(), title: z.string(), status: z.string(), rentedBy: z.string(), returnDate: z.string() }))
    .mutation(({ctx, input }) => {
      return ctx.prisma.video.update({
        data: {
          title: input.title,
          status: input.status,
          rentedBy: input.rentedBy,
          returnDate: input.returnDate
        },
        where: {
          id: input.id
        }
      });
    }),
  deleteOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ctx, input }) => {
      return ctx.prisma.video.delete({
        where: {
          id: input.id
        }
      });
    }),
});
