import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function FAQ() {
  return (
    <div id="faq" className="pt-10 pb-24 md:pt-10 md:pb-24">
      <div className="mx-auto max-w-screen-sm lg:max-w-screen-md mb-8 text-center px-2.5">
        <div className="mx-auto mb-24 sm:max-w-2xl">
          <h1 className="text-6xl font-bold sm:text-6xl">Česta pitanja</h1>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl text-left">
              Šta je potrebno za korišćenje aplikacije?
            </AccordionTrigger>
            <AccordionContent className="text-left text-base pr-8">
              Za korišćenje ClassMaster aplikacije neophodan Vam je računar
              (desktop ili laptop) i internet konekcija. Aplikacija se može
              koristiti i na drugim uređajima, ali zbog preglednosti naša
              preporuka jeste računar tj. uređaji sa većim ekranom.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl text-left">
              Kako doći do aplikacije?
            </AccordionTrigger>
            <AccordionContent className="text-left text-base pr-8">
              Sve što je potrebno jeste da nam se obratite putem e-mail adrese:
              info@classmaster.rs ili putem kontakt forme ispod, a mi ćemo Vam
              odgovoriti u najkraćem mogućem roku sa instrukcijama,
              prezentacijom i odgovorima na sva Vaša pitanja.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl text-left">
              Šta još dobijam?
            </AccordionTrigger>
            <AccordionContent className="text-left text-base pr-8">
              Pored navedenih mogućnosti izabranog paketa aplikacije dobijate:
              <ul className="list-disc list-inside">
                <li>
                  Ličnu ili u digitalnom obliku prezentacija aplikacije u cilju
                  obuke
                </li>
                <li>Pravo na nove verzije Update</li>
                <li>Tehnička podrška i održavanje</li>
                <li>Svakodnevna rezervna kopija backup Vaših podataka</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl text-left">
              Da li je aplikacija dostupna u svakoj državi?
            </AccordionTrigger>
            <AccordionContent className="text-left text-base pr-8">
              Da, nije važno odakle ste, aplikacija je dostupna za sve države.
              <br />
              <br />
              Aplikacija je dostupna na više jezika multilanguage, ukoliko
              aplikacija nije dostupna na Vašem lokalnom jeziku, možete nam se
              obratiti sa tom željom a mi ćemo se potruditi da Vam omogućimo
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-xl text-left">
              Ako dođe do problema, kome da se obratim?
            </AccordionTrigger>
            <AccordionContent className="text-left text-base pr-8">
              Možete nam se obratiti sa problemom na email adresu:
              support@classmaster.rs, a mi ćemo se potruditi u najkraćem mogućem
              vremenu da proverimo i reagujemo.
              <br />
              <br />
              Takođe u aplikaciji imate odeljak Tehnička podrška, gde imate
              podatke i kontakt formu koju možete popuniti i prijaviti nam
              problem.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
