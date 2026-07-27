import type { AccountRole } from './auth';

export type AdminUserListDto = {
  id: number;
  email: string;
  role: AccountRole;
  suspended: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};
