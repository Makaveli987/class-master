"use client";
import Link from "next/link";

import { buttonVariants } from "./ui/button";

import { ArrowRight } from "lucide-react";
// import UserAccountNav from './UserAccountNav'
// import MobileNav from './MobileNav'
import MaxWidthWrapper from "./max-width-wrapper";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Logo from "./ui/logo";

const Navbar = () => {
  const session = useSession();
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <Logo />
          </Link>

          {/* <MobileNav isAuth={!!user} /> */}

          <div className="hidden items-center space-x-4 sm:flex">
            {!session.data?.user ? (
              <>
                <Link
                  href="/pricing"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Pricing
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                  href={"/sign-in"}
                >
                  Sign in
                </Link>
                <Link
                  className={buttonVariants({
                    size: "sm",
                  })}
                  href={"/"}
                >
                  Get started <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/school/calendar"
                  className={buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  })}
                >
                  Dashboard
                </Link>

                {/* <UserAccountNav
                    name={
                      !user.given_name || !user.family_name
                        ? "Your Account"
                        : `${user.given_name} ${user.family_name}`
                    }
                    email={user.email ?? ""}
                    imageUrl={user.picture ?? ""}
                  /> */}
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
