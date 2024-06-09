import { CalendarClockIcon, School2Icon, UserPlus2Icon } from "lucide-react";
import MaxWidthWrapper from "./max-width-wrapper";

export default function HowItWorks() {
  return (
    <MaxWidthWrapper>
      <section className="w-full py-12 md:py-24">
        <div className="container grid gap-6 md:gap-8 px-0">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="mx-auto mb-10 sm:max-w-lg">
              <h1 className="text-6xl font-bold sm:text-6xl">Kako radi</h1>
              <p className="mt-5 text-muted-foreground sm:text-lg">
                Pristupanje našoj platformi je veoma lako i jednostavno.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-lg shadow-md bg-card border hover:border hover:border-blue-600 hover:shadow-blue-200 hover:dark:border-blue-700 hover:dark:shadow-blue-900">
              <div className="bg-accent rounded-full p-3">
                <UserPlus2Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Napravite nalog</h3>
              <p className="text-muted-foreground text-center">
                Prijavite svoju školu na našoj platformi sa osnovnim
                informacijama.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-lg shadow-md bg-card border hover:border hover:border-blue-600 hover:shadow-blue-200 hover:dark:border-blue-700 hover:dark:shadow-blue-900">
              <div className="bg-accent rounded-full p-3">
                <School2Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl text-center font-bold">
                Dodajte kurseve, nastavnike i učenike
              </h3>
              <p className="text-muted-foreground text-center">
                Lako dodajte kurseve, nastavnike i učenike. Dodelite uloge i
                dozvole da biste osigurali da svi imaju pristup pravim alatima.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 p-6 rounded-lg shadow-md bg-card border hover:border hover:border-blue-600 hover:shadow-blue-200 hover:dark:border-blue-700 hover:dark:shadow-blue-900">
              <div className="bg-accent rounded-full p-3">
                <CalendarClockIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Počnite sa zakazivanjem</h3>
              <p className="text-muted-foreground text-center">
                Kreirajte i upravljajte časovima, kursevima i rasporedima.
                Dodelite nastavnike i učenike kursevima bez napora.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  );
}
