import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "SCHOOL_ADMIN" | "USER";
    schoolId?: string;
  }

  interface Session {
    user: User;
  }
} 