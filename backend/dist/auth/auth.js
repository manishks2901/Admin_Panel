"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const trpc_1 = require("../server/trpc");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.authRouter = (0, trpc_1.router)({
    signIn: trpc_1.baseProcedure
        .input(zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(6) }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        const user = yield ctx.db.user.findUnique({ where: { email: input.email } });
        if (!user || user.password !== input.password) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET || "", { expiresIn: '1h' });
        return {
            message: 'Signed in',
            token,
            user: { id: user.id, email: user.email },
        };
    })),
    signOut: trpc_1.baseProcedure.mutation(() => __awaiter(void 0, void 0, void 0, function* () {
        return { message: 'Token should be cleared on client side.' };
    })),
    me: trpc_1.baseProcedure.query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        if (!ctx.user)
            throw new Error('Not authenticated');
        return {
            id: ctx.user.id,
            email: ctx.user.email,
        };
    })),
});
