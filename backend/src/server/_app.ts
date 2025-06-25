import { createServer } from 'http';
import { baseProcedure, router } from "./trpc";
import { authRouter } from "../auth/auth";
import { createContext } from "../context/context";
import * as trpcExpress from '@trpc/server/adapters/express';
import express from "express"
const app = express()

const appRouter = router({
    auth:authRouter
})

export type AppRouter = typeof appRouter

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(4000);