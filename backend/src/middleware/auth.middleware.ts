import jwt from "jsonwebtoken"
import { Request,Response,NextFunction, RequestHandler } from "express"
import db from "../lib/db";

declare global{
    namespace Express{
        interface Request{
            user?:any;
        }
    }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                message:"Unauthorized - No token Provided"
            })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        if(!decoded){
            return res.status(401).json({
                message:"Unauthorized - Invalid Token"
            })
        }
        const user = await db.user.findUnique({
            where: { id: decoded.userId },
            select: { 
                id:true,
                email:true
             }
        });

        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }
        req.user = user;

        next()
    }
    catch(e) {
        console.error(e);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}