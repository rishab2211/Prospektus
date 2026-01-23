import { type Request, type Response } from "express";

type signupArgs = {
    name?: string,
    userId : string,
    password : string
}



export const signup = (req : Request, res : Response)=>{

    const {name, userId, password} = req.body ;

    if(!userId || !password){
        return res.status(400).send("userId and password are required");
    }


}

export const signin = (req : Request, res : Response)=>{
    
}