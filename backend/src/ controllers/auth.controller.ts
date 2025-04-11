import { generateToken } from "../lib/utils";
import db from "../lib/db"
import bcrypt from "bcrypt"
import { Request,Response } from "express"
import cloudinary from "../lib/cloudinary";

import streamifier from 'streamifier';
import dotenv from "dotenv"
import { fileURLToPath } from "url";
dotenv.config()
// Promise<express.Response<any, Record<string, any>> | undefined>
export const signup = async (req:Request,res:Response):Promise<Response<any, Record<string, any>> | undefined> => {
    const { name , email , password } = req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All the fields are required"
            })
        }
        if(password.length < 6 ){
            return res.status(400).json({
                message:"Password must be at least 6 characters"
            })
        }
        const user = await db.user.findFirst({
            where:{
                email
            }
        })
        if(user) return res.status(400).json({
            message:"Email already exist"
        })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = await db.user.create({
            data:{
                name,
                email,
                password:hashedPassword,
                profilePic:""
            }
        })
        if(newUser){
            generateToken(newUser.id,res)
            res.status(201).json({
                _id:newUser.id,
                name:newUser.name,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }else{
            res.status(400).json({
                message:"Invalid user data"
            })
        }
    }
    catch(error){
        console.log("Error in signup controller :",error)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}


export const login = async(req:Request,res:Response) =>{
    const { email, password } =req.body;
    try{
        const user = await db.user.findFirst({
            where:{
                email
            }
        })
        if(!user) return res.status(400).json({message:"Invalid Credentials"})
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentails"})
        await generateToken(user.id,res)
        res.status(200).json({
            _id:user.id,
            name:user.name,
            email:user.email,
            profilePic:user.profilePic
        })
    }catch(error){
        console.log("Error in login Credentials",error)
        res.status(200).json({message:"Internal Server Error"})
    }

}

export const logout = async (req:Request,res:Response ) => {
    try{
        res.cookie("jwt","",{ maxAge : 0})
        res.status(200).json({message:"Logged out successfully"})
    }catch(error){
        console.log("Error in logout controller",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ message: 'No file uploaded or buffer missing' });
      }
      const user = await req.user;
  
      const streamUpload = (buffer: Buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) resolve(result);
            else reject(error);
          });
  
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };
  
      const result: any = await streamUpload(req.file.buffer);
  
      await db.user.update({
        where: {
            email:user.email
        },
        data: { profilePic: result.secure_url },
      });
  
      res.status(200).json({ message: 'Profile updated', url: result.secure_url });
    } catch (err) {
      console.error('UpdateProfile Error:', err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

