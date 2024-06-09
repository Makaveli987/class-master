"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, Check, HelpCircle, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MaxWidthWrapper from "./max-width-wrapper";
import { Separator } from "./ui/separator";

const PLANS = [
  {
    name: "Besplatno",
    slug: "besplatno",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Srednje",
    slug: "srednje",
    quota: 25,
    pagesPerPdf: 25,
    price: {
      amount: 49,
      priceIds: {
        test: "price_1NuEwTA19umTXGu8MeS3hN8L",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 79,
      priceIds: {
        test: "price_1NuEwTA19umTXGu8MeS3hN8L",
        production: "",
      },
    },
  },
];

const Pricing = () => {
  const session = useSession();

  const pricingItems = [
    {
      plan: "Besplatno",
      tagline: "Za isprobavanje i individualne nastavnike.",
      features: [
        {
          text: "1 nastavnik",
          footnote: "Maksimalan broj nastavnika.",
        },
        {
          text: "5 kurseva",
          footnote: "Maksimalan broj kurseva.",
        },
        {
          text: "20 učenika",
          footnote: "Maksimalan broj učenika.",
        },
        {
          text: "Neograničeno časova",
        },
        {
          text: "Finansije",
        },
        {
          text: "Analitika",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
      ],
    },
    {
      plan: "Srednje",
      tagline: "Za male i srednje škole.",
      features: [
        {
          text: "15 nastavnika",
          footnote: "Maksimalan broj nastavnika.",
        },
        {
          text: "20 kurseva",
          footnote: "Maksimalan broj kurseva.",
        },
        {
          text: "300 učenika",
          footnote: "Maksimalan broj učenika.",
        },
        {
          text: "Neograničeno časova",
        },
        {
          text: "Finansije",
        },
        {
          text: "Analitika",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: false,
        },
      ],
    },
    {
      plan: "Pro",
      tagline: "For larger projects with higher needs.",
      features: [
        {
          text: "25 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  return (
    <div id="pricing" className="bg-accent py-24">
      <MaxWidthWrapper className="mb-8 text-center max-w-6xl md:px-2.5">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-6xl">Cenovnik</h1>
          <p className="mt-5 text-muted-foreground sm:text-lg">
            Aplikacija nudi izbor paketa prema potrebama škola. Za više
            informacija kontaktirajte nas!
          </p>
        </div>

        <div className="pt-12 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, features }) => {
              const price =
                PLANS.find((p) => p.slug === plan.toLowerCase())?.price
                  .amount || 0;

              return (
                <div
                  key={plan}
                  className={cn("relative rounded-2xl bg-card shadow-lg", {
                    "border-2 border-blue-600 shadow-blue-200 dark:border-blue-700 dark:shadow-blue-900":
                      plan === "Medium",
                    border: plan !== "Medium",
                  })}
                >
                  {plan === "Medium" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white">
                      Most Popular
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="my-3 text-center font-display text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-muted-foreground">{tagline}</p>
                    <p className="my-5 font-display text-6xl font-semibold">
                      &euro;{price}
                    </p>
                    <p className="text-muted-foreground">mesečno</p>
                  </div>

                  {/* <div className="flex h-20 items-center justify-center border-b border-t border bg-slate-50 dark:bg-slate-700">
                    <div className="flex items-center space-x-1">
                      <p>{quota.toLocaleString()} PDFs/mo included</p>

                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="cursor-default ml-1.5">
                          <HelpCircle className="h-4 w-4 text-zinc-500" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          How many PDFs you can upload per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div> */}
                  <Separator className="mt-3" />

                  <ul className="my-10 space-y-5 px-8">
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <XIcon className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <Check className="h-6 w-6 text-emerald-500" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn("text-muted-foreground", {
                                "text-muted-foreground line-through": negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5">
                                <HelpCircle className="h-4 w-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn("text-muted-foreground", {
                              "text-muted-foreground line-through": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t" />
                  <div className="p-5">
                    {plan === "Free" ? (
                      <Link
                        href={session.data?.user ? "/dashboard" : "/sign-in"}
                        className={buttonVariants({
                          className: "w-full",
                          variant: "secondary",
                        })}
                      >
                        {session.data?.user ? "Upgrade now" : "Sign up"}
                        <ArrowRightIcon className="h-5 w-5 ml-1.5" />
                      </Link>
                    ) : session.data?.user ? (
                      //   <UpgradeButton />
                      <Button> Upgrade</Button>
                    ) : (
                      <Link
                        href="/sign-in"
                        className={buttonVariants({
                          className: "w-full",
                        })}
                      >
                        {session.data?.user ? "Upgrade now" : "Sign up"}
                        <ArrowRightIcon className="h-5 w-5 ml-1.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Pricing;
