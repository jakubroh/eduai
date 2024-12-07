import "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    schoolId?: string;
  }

  interface Session {
    user: User;
  }
} 