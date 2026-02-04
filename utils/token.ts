import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

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
            
        // console.log("Verifying token: " , token)
        return jwt.verify(token , JWT_SECRET) as UserPayload
    }catch(err){
        console.log(err)
        throw err
    }
}

export async function validateRequest(req: NextRequest, targetId: string): Promise<boolean> {

  const adminToken = (await cookies()).get('token')
    if (adminToken) { 
        return true
    }

  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];
  try {
    const user = await verifyToken(token);
    if (user.role == 'admin') {
        return true; 
    }
    if (!user || user.id !== targetId) {
      return false; 
    }
    return true; 
  } catch (error) {

    return false;
  }
}

export async function IsAdmin() {
    const token = (await cookies()).get('token')?.value
    if(!token) return false

    const user= await verifyToken(token)
    
    return user.role =='admin' ? true : false
}

export async function getUserIdFromRequest
(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    id: string;
    role?: string;
    };

    return payload.id;
  } catch {
    return null;
  }
}

