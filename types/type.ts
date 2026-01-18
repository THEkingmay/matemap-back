interface User{
    id: string , 
    email: string , 
    hash_password : string , 
    role : 'admin' | 'user' | 'member' , // นิสิต แอดมิน และหอพักที่สมัครรายเดือน
    created_at : string
}
interface UserCard{
  id : string , 
  name : string ,
  bio : string ,
  avatar_url : string , 
  tags : string[]
}

export type {User , UserCard}