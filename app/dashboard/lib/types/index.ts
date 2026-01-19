export interface DormListProps {
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
    phoneNumber: string;
    idLine?: string;
    socialMediaLink?: string;
    role : 'member' | 'user' | 'service' // Needed?
};

export interface DormCardProps {
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

export interface DormContentProps {
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
    phoneNumber: string;
    idLine?: string; // fix type add '?'
    socialMediaLink?: string;
};
