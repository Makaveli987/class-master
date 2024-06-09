import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import MaxWidthWrapper from "./max-width-wrapper";

const features = [
  {
    title: "Upravljanje učenicima",
    items: [
      {
        title: "Upis i registracija:",
        description:
          "Lako upravljajte upisima i registracijama učenika sa pojednostavljenim procesima.",
      },
      {
        title: "Profili učenika:",
        description:
          "Održavajte sveobuhvatne profile učenika uključujući lične podatke, akademsku istoriju i evidenciju o pohađanju.",
      },
      {
        title: "Praćenje prisustva:",
        description: "Pratite i beležite prisustvo učenika u realnom vremenu.",
      },
      {
        title: "Upravljanje ocenama:",
        description:
          "sa lakoćom unosite, čuvajte i preuzimajte ocene učenika i izveštaje o učinku.",
      },
    ],
    image: "/students-view-2.png",
    inverted: false,
  },
  {
    title: "Upravljanje časovima",
    items: [
      {
        title: "Zakazivanje časova:",
        description:
          "Zakažite i upravljajte časovima pomoću fleksibilnih alatki lakih za korišćenje.",
      },
      {
        title: "Raspored časova:",
        description:
          "Imajte uvid u raspored časova za svakog nastavnika na veoma preglednom kalendaru.",
      },
      {
        title: "Praćenje prisustva:",
        description: "Pratite i beležite prisustvo učenika na svakom času.",
      },
    ],
    image: "/students-view-2.png",
    inverted: true,
  },
  {
    title: "Finansije",
    items: [
      {
        title: "Upravljanje naknadama:",
        description: "Pratite detaljno prihode, rashode i dugovanja.",
      },
      {
        title: "Finansijsko izveštavanje:",
        description:
          "Generišite detaljne finansijske izveštaje i izveštaje za školsku administraciju.",
      },
      {
        title: "Administracija:",
        description:
          "Automatizujte naplatu, fakturisanje i generisanje računa za različite školarine.",
      },
    ],
    image: "/students-view-2.png",
    inverted: false,
  },
  {
    title: "Analitika",
    items: [
      {
        title: "Finansijska analitika:",
        description:
          "Pristupite detaljnoj finansijskoj analitici za praćenje prihoda, rashoda i dugovanja.",
      },
      {
        title: "Analitika upisa kurseva:",
        description:
          "Pratite trendove upisa kurseva, identifikujte popularne kurseve i optimizujte ponude nastavnog plana i programa na osnovu uvida u podatke.",
      },
      {
        title: "Analitika učenika i grupa:",
        description:
          "Pratite i analizirajte broj aktivnih i neaktivnih učenika i grupa tokom vremena.",
      },
    ],
    image: "/students-view-2.png",
    inverted: true,
  },
];

export default function Features() {
  return (
    <MaxWidthWrapper className="text-center max-w-6xl md:px-2.5">
      {features.map((feature) => (
        <section
          id="features"
          key={feature.title}
          className="w-full py-12 md:py-20"
        >
          <div
            className={cn(
              "container flex flex-col-reverse items-center justify-between gap-12 px-0",
              feature.inverted ? "lg:flex-row-reverse" : "lg:flex-row"
            )}
          >
            <div className="flex-1 rounded-xl shadow-lg">
              <Image
                alt="Product Image"
                className="mx-auto rounded-xl object-cover object-center sm:w-full"
                height="500"
                src={feature.image}
                style={{
                  aspectRatio: "600/450",
                  objectFit: "cover",
                }}
                width="600"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-left tracking-tighter sm:text-3xl md:text-4xl">
                  {feature.title}
                </h2>
              </div>
              <ul className="space-y-2">
                {feature.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="rounded-full bg-emerald-0 p-1">
                      <CheckIcon className="size-5 flex-shrink-0 text-emerald-600" />
                    </div>
                    <div className="flex">
                      <h3 className="font-normal text-left text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {item.title}
                        </span>{" "}
                        {item.description}
                      </h3>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </MaxWidthWrapper>
  );
}
