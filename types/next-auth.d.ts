import { Role, School } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      color: string;
      archived: boolean;
      id: string;
      role: Role;
      firstName: string;
      lastName: string;
      email: string;
      school: School;
    };
  }
}
