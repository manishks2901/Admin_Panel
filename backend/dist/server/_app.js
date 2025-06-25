"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_cjs_1 = require("@trpc/server/dist/adapters/standalone.cjs");
const trpc_1 = require("./trpc");
const auth_1 = require("../auth/auth");
const context_1 = require("../context/context");
const appRouter = (0, trpc_1.router)({
    auth: auth_1.authRouter
});
(0, standalone_cjs_1.createHTTPServer)({
    router: appRouter,
    createContext: context_1.createContext,
}).listen(3000);
