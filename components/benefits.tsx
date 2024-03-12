import { EuroIcon, CalendarCheckIcon } from "lucide-react";
import React from "react";
import MaxWidthWrapper from "./max-width-wrapper";

function FireIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
      />
    </svg>
  );
}

const benefits = [
  {
    icon: <FireIcon />,
    title: "Efikasnost i Automatizacija",
    description:
      "ClassMaster omogućava lako praćenje finansija, evidenciju studenata i analizu performansi. Ovaj pristup smanjuje administrativna opterećenja i pomaže u donošenju informisanih odluka za unapređenje rada škola.",
  },
  {
    icon: <EuroIcon />,
    title: "Poboljšajte Finansije",
    description:
      "Vođenje biznisa zahteva besprekornu finansijsku administraciju. ClassMaster olakšava finansijsko upravljanje i omogućava brzo, jednostavno i finansijsko izveštavanje bez grešaka.",
  },
  {
    icon: <CalendarCheckIcon />,
    title: "Olakšajte Zakazivanje",
    description:
      "Organizacija događaja i časova je jednostavna sa vizuelnim kalendarom i moćnim funkcijama za planiranje. Sprečite dvostruke rezervacije i sa lakoćom primenite složene rasporede.",
  },
];

export default function Benefits() {
  return (
    <div className="bg-slate-50 mt-20 py-5">
      <MaxWidthWrapper className="mb-8 text-center max-w-6xl md:px-2.5">
        <div className="mx-auto mb-32 mt-20">
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
                Zašto ClassMaster?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Upravljajte efikasno svim procesima, bez obzira na veličinu vaše
                obrazovne institucije.
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-3 pt-16">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className={
                  "relative rounded-2xl bg-card shadow-lg border border-gray-200 p-6"
                }
              >
                <div className="space-y-3 text-center">
                  <span className="inline-block size-12 p-3 text-white bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl dark:text-white dark:bg-blue-500">
                    {benefit.icon}
                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
                    {benefit.title}
                  </h1>

                  <p className="text-gray-500 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
