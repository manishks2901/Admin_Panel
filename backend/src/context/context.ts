import dotenv from "dotenv"
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone"
import jwt from "jsonwebtoken"
import { db } from "../db/db";


dotenv.config()
export const createContext = async({req,res}:CreateHTTPContextOptions) =>{
    const token = req.headers.authorization?.split(' ')[1] || '';

    let user = null;

    if(token){
        try{
            const payload = jwt.verify(token,process.env.JWT_SECRET || "" ) as {
                id:string
            }
            user =await db.user.findUnique({
                where:{
                    id:payload.id as string
                }
            })
        }catch(e){
            user = null;
        }
    }

    return {
        req,
        res,
        db,
        user,
    }
}

export type Context = Awaited<ReturnType<typeof createContext>>
