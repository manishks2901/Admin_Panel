import { z } from "zod"
import jwt from "jsonwebtoken"
import { router,baseProcedure } from "../server/trpc"
import dotenv from "dotenv"
import { db } from "../db/db"
import bcrypt from "bcryptjs"
dotenv.config();

export const authRouter = router({
     signUp: baseProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const newUser = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || "", {
        expiresIn: '1h',
      });

      return {
        message: 'User created',
        token,
        user: { id: newUser.id, email: newUser.email },
      };
    }),

  signIn: baseProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(input.password, user.password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
        expiresIn: '1h',
      });

      return {
        message: 'Signed in',
        token,
        user: { id: user.id, email: user.email },
      };
    }),

  signOut: baseProcedure.mutation(async () => {
    return { message: 'Token should be cleared on client side.' };
  }),

  me: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error('Not authenticated');

    return {
      id: ctx.user.id,
      email: ctx.user.email,
    };
  }),
})