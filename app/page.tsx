import Benefits from "@/components/benefits";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Pricing from "@/components/pricing";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon, MonitorIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="h-[30rem] w-full dark:bg-black bg-white  dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex ">
        {/* Radial gradient for the container to give a faded look */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
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
          <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
            ClassMaster predstavlja online aplikaciju koja je kreirana za
            potrebe škola stranih jezika u cilju optimizacije njihovog
            poslovanja, efikasnije evidencije studenata i smanjenja
            papirologije.
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
            <Link
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "mt-5",
              })}
              href="/dashboard"
              target="_blank"
            >
              Demo <MonitorIcon className="ml-2 h-4 w-4" />
            </Link>
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
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <Image
                    src="/calendar-view.JPG"
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
      <Benefits />
      <Pricing />
    </>
  );
}
