export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type CreateUserPayload = {
  email: string;
  displayName: string;
  role?: UserRole;
  isActive?: boolean;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;
