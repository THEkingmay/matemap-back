interface User{
    id: string , 
    email: string , 
    hash_password : string , 
    role : 'admin' | 'user' | 'member' , // นิสิต แอดมิน และหอพักที่สมัครรายเดือน
    created_at : string
}
interface UserCard {
  id: string;
  name: string;
  age?: number;
  faculty?: string;
  major?: string;
  tags?: string[];
  image_url?: string;
}

export type {User , UserCard}