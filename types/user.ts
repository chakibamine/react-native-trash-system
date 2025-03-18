export enum Role {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  NORMAL_USER = 'NORMAL_USER',
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
  address?: string;
  phoneNumber?: string;
  hasPendingReports?: boolean;
  licenseNumber?: string;
  isAvailable?: boolean;
  managedBins?: string[];
  createdAt?: Date;
} 