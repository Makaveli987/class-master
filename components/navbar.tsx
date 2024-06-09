"use client";
import Link from "next/link";

import { Button, buttonVariants } from "./ui/button";
import MaxWidthWrapper from "./max-width-wrapper";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Logo from "./ui/logo";
import { ArrowRightIcon } from "lucide-react";

const Navbar = () => {
  const session = useSession();
  const pathname = usePathname();

  if (pathname !== "/") {
    return null;
  }

  function scrolltoHash(id: string) {
    const element = document.getElementById(id);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-50 w-full border-b bg-card/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex z-40 font-semibold">
            <Logo />
          </Link>

          {/* <MobileNav isAuth={!!user} /> */}

          <div className="hidden items-center space-x-4 sm:flex">
            {!session.data?.user ? (
              <>
                <Button
                  variant={"ghost"}
                  onClick={() => scrolltoHash("features")}
                >
                  Usluge
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={() => scrolltoHash("pricing")}
                >
                  Cenovnik
                </Button>
                <Button variant={"ghost"} onClick={() => scrolltoHash("faq")}>
                  FAQ
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={() => scrolltoHash("contact")}
                >
                  Kontakt
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/school/calendar"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Aplikacija <ArrowRightIcon className="size-4 ml-2" />
                </Link>
              </>
            )}
          </div>
          {!session.data?.user && (
            <div className="flex gap-4">
              <Link
                className={buttonVariants({
                  variant: "secondary",
                  size: "default",
                })}
                href={"/sign-up"}
              >
                Registracija
              </Link>
              <Link
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                })}
                href={"/sign-in"}
              >
                Prijava
              </Link>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
