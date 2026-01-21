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

export interface PendingPost {
    id: string;
    post_by: string;
    title: string;
    price: number;
    createdAt: string;
    status: string;
}
export interface ApprovedPost {
    id: string;
    post_by: string;
    title: string;
    price: number;
    createdAt: string;
    status: string;
}

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