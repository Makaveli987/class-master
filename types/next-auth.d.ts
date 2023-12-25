import { Role, School } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      Role: Role;
      firstName: string;
      lastName: string;
      email: string;
      School: School;
    };
  }
}
