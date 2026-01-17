interface User{
    id: string , 
    email: string , 
    hash_password : string , 
    role : 'admin' | 'user' | 'member' , // นิสิต แอดมิน และหอพักที่สมัครรายเดือน
    created_at : string
}

export type {User}