import { db } from "@/lib/db";

export const getAdminRole = async () => {
  try {
    const adminRole = await db.role.findFirst({ where: { type: "ADMIN" } });
    return adminRole;
  } catch (error) {
    console.error("[ROLES] Error fetching ADMIN role");
    return null;
  }
};
