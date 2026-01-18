export interface DormListProps {
  dorms: Array<{
    id: number;
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
    role: string;
  }>;
}

export interface DormCardProps {
  dorm: {
    id: number;
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
}

export interface DormContentProps {
  dorm: {
    id: number;
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
}
