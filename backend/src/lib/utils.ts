import jwt from "jsonwebtoken"
import { Response } from "express"
export const generateToken = (userId:String, res:Response ) =>{
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn:"2d"
    })

    res.cookie("jwt",token,{
        maxAge:2*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development"
    })

    return token
}