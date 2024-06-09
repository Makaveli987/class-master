"use client";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MaxWidthWrapper from "./max-width-wrapper";
import Autoplay from "embla-carousel-autoplay";
import { StarIcon } from "lucide-react";

export default function Features() {
  return (
    <div className="py-12 md:py-24">
      <MaxWidthWrapper className="mb-8 text-center max-w-6xl md:px-2.5 overflow-hidden">
        <div className="mx-auto mb-10 sm:max-w-2xl">
          <h1 className="text-6xl font-bold sm:text-6xl">
            What Clients Saying
          </h1>
        </div>
        <Carousel
          plugins={[Autoplay({ delay: 4000 })]}
          opts={{
            align: "center",
          }}
          className="w-full max-w-screen-sm mx-auto mt-20"
        >
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card className="flex flex-col items-center justify-center py-8 px-0 text-center max-w-3xl mx-auto border-0 shadow-none">
                  <blockquote className="text-lg font-medium leading-relaxed mb-4">
                    `&ldquo;The product has been a game-changer for my business.
                    It`&apos;`s easy to use and has significantly improved our
                    efficiency.`&ldquo;
                  </blockquote>
                  <div className="flex mb-3">
                    <StarIcon
                      fill="yellow"
                      strokeWidth={1}
                      className="text-yellow-300"
                    />
                    <StarIcon
                      fill="yellow"
                      strokeWidth={1}
                      className="text-yellow-300"
                    />
                    <StarIcon
                      fill="yellow"
                      strokeWidth={1}
                      className="text-yellow-300"
                    />
                    <StarIcon
                      fill="yellow"
                      strokeWidth={1}
                      className="text-yellow-300"
                    />
                    <StarIcon
                      fill="yellow"
                      strokeWidth={1}
                      className="text-yellow-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">John Doe {index}</h4>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                      CEO, Acme Inc.
                    </p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </MaxWidthWrapper>
    </div>
  );
}
