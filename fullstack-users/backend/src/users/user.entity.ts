export type UserRole = 'user' | 'admin';

export interface UserEntity {
  id: string;            
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;     
  updatedAt: number;     
}
