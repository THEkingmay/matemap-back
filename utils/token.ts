import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET!
const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT!) || 10

interface UserPayload extends JwtPayload{
    id : string , 
    role : string
}

export async function hash_password_genarate(password : string){
   try{
        if(!BCRYPT_SALT) throw new Error("ไม่มีค่า salt")
        return await bcrypt.hash(password , BCRYPT_SALT)
    }catch(err){
        throw err
    }
}

export async function verifyPassword(password : string,hash_password : string){
   return await bcrypt.compare(password,hash_password)
}

export async function genarateToken(id : string , role : string) {
    try{
        if(!JWT_SECRET) throw new Error("ไม่มี JWT Secret")

        return jwt.sign({id , role} , JWT_SECRET , {expiresIn : '1d'}  )
    }catch(err){
        throw err
    }
}

export async function verifyToken(token : string){
    try{
        if(!JWT_SECRET) throw new Error("ไม่มี JWT Secret")
            
        console.log("Verifying token: " , token)
        return jwt.verify(token , JWT_SECRET) as UserPayload
    }catch(err){
        console.log(err)
        throw err
    }
}
