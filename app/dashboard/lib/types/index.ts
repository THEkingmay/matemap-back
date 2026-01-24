export interface DormListProps {
    id: string;
    created_at: string; 
    owner_name: string;
    owner_tel: string;
    name: string;
    dorm_number: string;
    district: string;
    sub_district: string;
    city: string;
    province: string;
    postal_code: string;
    detail: string;
    id_line?: string;
    social_media_link?: string;
};

export interface DormCardProps {
    id: string;
    name: string;
    created_at: string;
    owner_name: string;
  };

export interface DormContentProps {
    id: string;
    created_at: string; 
    owner_name: string;
    owner_tel: string;
    name: string;
    dorm_number: string;
    district: string;
    sub_district: string;
    city: string;
    province: string;
    postal_code: string;
    detail: string;
    id_line?: string;
    social_media_link?: string;
};

export interface DormTabProps {
    id: string;
    name: string;
    start_date: Date;
    expire_date: Date;
}

// Contract Post Types (ContractPost สร้างตามที่ออกแบบไว้ใน Docs)
export type ContractPost = {
  contract_posts_id: string;
  post_by: string;
  title: string;
  price: number;
  dorm_number: string;
  postalCode: string;
  province: string;
  city: string;
  district: string;
  street: string;
  detail: string;
  createdAt: string;
  status: "อนุมัติแล้ว" | "รอการอนุมัติ";
};


export interface AllServiceHistory {
    id: string;
    type: string;
    customer: string;
    customerPhone: string;
    provider: string;
    providerPhone: string;
    date: string;
    time: string;
    location: {
      start: string;
      destination: string;
    },
    price: number;
    status: string;
}

export type StatusConfigItem = {
  bg: string;
  text: string;
};

export type ServiceStatus = "รอยืนยัน" | "ยืนยันแล้ว" | "เสร็จสิ้น" | "ยกเลิก";

export interface FormEditData {
    id: string;
    created_at: string; 
    owner_name: string;
    owner_tel: string;
    name: string;
    dorm_number: string;
    district: string;
    sub_district: string;
    city: string;
    province: string;
    postal_code: string;
    detail: string;
    id_line?: string;
    social_media_link?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export type UserType = StudentUserDisplay | WorkerUserDisplay | DormUserDisplay;

export interface StudentUserDisplay {
  type: "นิสิต";
  id: string;
  name: string;
  birth_year?: number;
  faculty?: string;
  major?: string;
  image_url?: string;
}



export interface WorkerUserDisplay {
  type: "คนรับจ้าง";
  id: string;
  tel: string;
  name: string;
  image_url: string | null;
  created_at: Date;
  services: {
    id: string;
    name: string;
  }[];
}

export interface DormUserDisplay {
  type: "หอพัก";
  id: string;
  name: string;
  owner_name: string;
  owner_tel: string;
  dorm_number: string;
  district: string;
  city: string;
  province: string;
}
