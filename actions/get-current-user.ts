import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
// import { getServerSession } from "next-auth/next";

export async function getSession() {
  // return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    // const session = await getSession();

    // if (!session?.user?.email || session?.user?.archived) {
    //   return null;
    // }

    // const currentUser = await db.user.findUnique({
    //   where: {
    //     email: session.user.email as string,
    //   },
    //   include: {
    //     role: true,
    //   },
    // });

    // if (!currentUser) {
    //   return null;
    // }

    // return {
    //   ...currentUser,
    //   createdAt: currentUser.createdAt.toISOString(),
    //   updatedAt: currentUser.updatedAt.toISOString(),
    // };
    return { user: "test" };
  } catch (error: any) {
    return null;
  }
}
