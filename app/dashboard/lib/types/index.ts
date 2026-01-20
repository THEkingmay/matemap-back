export interface DormListProps {
    id: string;
    name: string;
    address: {
      number: string;
      street: string;
      district: string;
      city: string;
      province: string;
      postalCode: string;
    };
    detail: string;
    createdAt: Date;
    landlord: {
      name: string;
    };
    phoneNumber: string;
    idLine?: string;
    socialMediaLink?: string;
    role : 'member' | 'user' | 'service' // Needed?
};

export interface DormCardProps {
    id: string;
    name: string;
    address: {
      number: string;
      street: string;
      district: string;
      city: string;
      province: string;
      postalCode: string;
    };
    detail: string;
    createdAt: Date;
    landlord: {
      name: string;
    };
  };

export interface DormContentProps {
    id: string;
    name: string;
    address: {
      number: string;
      street: string;
      district: string;
      city: string;
      province: string;
      postalCode: string;
    };
    detail: string;
    createdAt: Date;
    landlord: {
      name: string;
    };
    phoneNumber: string;
    idLine?: string; // fix type add '?'
    socialMediaLink?: string;
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