import Contact from "@/components/contact";
import FAQ from "@/components/faq";
import Features from "@/components/features";
import Footer from "@/components/footer";
import HowItWorks from "@/components/how-it-works";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Pricing from "@/components/pricing";
import Testimonials from "@/components/testimonials";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="h-[30rem] w-full bg-card  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex ">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {/* <p className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
          Backgrounds
        </p> */}
        <MaxWidthWrapper className="mb-12 mt-28 sm:mt-28 flex flex-col items-center justify-start text-center z-30">
          {/* <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
            <p className="text-sm font-semibold text-gray-700">
              Quill is now public!
            </p>
          </div> */}
          <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
            {/* Chat with your <span className="text-blue-600">documents</span> in */}
            {/* seconds.  */}
            {/* The Modern System for foreign language{" "}
          <span className="text-blue-600">schools</span> */}
            Savremeni sistem za <span className="text-blue-600">škole</span>{" "}
            stranih jezika
          </h1>
          <p className="mt-5 max-w-prose text-muted-foreground sm:text-lg">
            {/* ClassMaster predstavlja online aplikaciju koja je kreirana za
            potrebe škola stranih jezika u cilju optimizacije njihovog
            poslovanja, efikasnije evidencije studenata i smanjenja
            papirologije. */}
            Pojednostavite administraciju škole uz našu platformu. Efikasno
            upravljajte upisom, studentima, prisustvom, ocenama i komunikacijom,
            uz izveštavanje u realnom vremenu.
          </p>

          <div className=" flex gap-4">
            <Link
              className={buttonVariants({
                size: "lg",
                className: "mt-5",
              })}
              href="/dashboard"
              target="_blank"
            >
              Probajte besplatno <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            {/* <Link
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "mt-5",
              })}
              href="/dashboard"
              target="_blank"
            >
              Demo <MonitorIcon className="ml-2 h-4 w-4" />
            </Link> */}
          </div>
        </MaxWidthWrapper>
      </div>

      {/* value proposition section */}
      <div>
        <div className="relative isolate">
          {/* <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div> */}

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-600/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/hero-dashboard.png"
                    alt="product preview"
                    width={1920}
                    height={1080}
                    quality={100}
                    className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <section className="w-full py-12 md:py-16 lg:py-20">
            <div className="container grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center gap-4 rounded-lg p-6 transition-all hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                  <School2Icon className="h-6 w-6" />
                </div>
                <div className="text-4xl font-bold">20+</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Škola
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-lg p-6 transition-all hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div className="text-4xl font-bold">4.500+</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Učenika
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-lg p-6 transition-all hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <div className="text-4xl font-bold">30.000+</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Časova
                </div>
              </div>
            </div>
          </section> */}

          {/* <div id="stats" class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-gray-600">Transactions every 24 hours</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          <span class="animate-[counter_3s_ease-out_forwards] tabular-nums [counter-set:_num_var(--num-transactions)] before:content-[counter(num)]"> <span class="sr-only">44</span>million </span>
        </dd>
      </div>
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-gray-600">Assets under holding</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          $<span class="animate-[counter_3s_ease-out_forwards] tabular-nums [counter-set:_num_var(--num-assets)] before:content-[counter(num)]"> <span class="sr-only">119</span> trillion </span>
        </dd>
      </div>
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-gray-600">New users annually</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          <span class="animate-[counter_3s_ease-out_forwards] tabular-nums [counter-set:_num_var(--num-users)] before:content-[counter(num)] before:left-[calc(0.4em * var(--n, 1))]">
            <span class="sr-only">4600</span>
          </span>
        </dd>
      </div>
    </dl>
  </div>
</div> */}

          {/* 
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div> */}
        </div>
      </div>

      {/* Feature section */}
      <div className="mt-28 bg-accent">
        <Features />
      </div>
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}
