interface User{
    id: string , 
    email: string , 
    hash_password : string , 
    role : 'admin' | 'user' | 'member' ,
    created_at : string
}

export type {User}