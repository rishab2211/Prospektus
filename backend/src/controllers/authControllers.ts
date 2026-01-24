import { type Request, type Response } from "express";
import { client } from "../lib/prisma";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";



type signupArgs = {
    name?: string,
    userId : string,
    password : string
}



export const signup = async (req : Request, res : Response)=>{

    const {name, userId, password} = req.body ;

    if(!userId || !password){
        return res.status(400).send("userId and password are required");
    }

    const checkIfAlreadyExists = await client.user.findFirst({
        where : {
            email : userId
        }
    });

    if(checkIfAlreadyExists){
        return res.status(409).send("User with this userId already exists");
    }

    const genSalt = genSaltSync(10);
    const hashedPass = hashSync(password, genSalt);

    const newUser = await client.user.create({
        data : {
            name, 
            email : userId,
            hashedPass : hashedPass
        }
    });

    return res.status(201).json({
        id : newUser.id,
        name : newUser.name,
        userId : newUser.email
    });

}

export const signin = async (req : Request, res : Response)=>{

    const {userId, password} = req.body ;

    if(!userId || !password){
        return res.status(400).send("userId and password are required");
    }

    const fetchUser = await client.user.findUnique({
        where :{
            email : userId
        }
    })

    if(!fetchUser){
        return res.status(404).send("User not found");
    }

    const hashedPass = fetchUser.hashedPass;
    
    const checkPassword = compareSync(password, hashedPass);

    if(!checkPassword){
        return res.status(401).send("Invalid credentials");
    }

    return res.status(200).json({
        id : fetchUser.id,
        name : fetchUser.name,
        userId : fetchUser.email
    }); 

    
}