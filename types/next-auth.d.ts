import { Role, School } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      archived: any;
      id: string;
      Role: Role;
      firstName: string;
      lastName: string;
      email: string;
      School: School;
    };
  }
}
