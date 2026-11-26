import Image from "next/image";
import { CtaBlock } from "@/components/sections";
import { Container, PageHero } from "@/components/site-chrome";

export const metadata = { title: "Co-working space" };

const seats = [
  ["Hot desk", "Any free desk, day access"],
  ["Dedicated desk", "Your own desk, 24x7 access"],
  ["Cabin", "Private cabin for 4–6 people"],
  ["Virtual membership", "Address, mentoring and pay-per-use labs"],
];

export default function CoWorking() {
  return (
    <>
      <PageHero eyebrow="Services · Co-working" title="30 seats on the SRIHER campus" sub="Desks, cabins, cubicles and bookable meeting rooms with internet and video-conferencing." img="/img/cowork1.jpg" />
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <Image src="/img/cowork.jpg" alt="Co-working space" width={700} height={480} className="rounded-2xl" />
        <div className="grid gap-3">
          {seats.map(([t, d]) => (
            <div key={t} className="rounded-xl bg-surface p-4"><p className="font-semibold text-brand-dark">{t}</p><p className="text-sm text-slate-600">{d}</p></div>
          ))}
          <p className="text-xs text-slate-500">Seats are billed monthly with 18% GST. Rates are shared during onboarding.</p>
        </div>
      </Container>
      <CtaBlock />
    </>
  );
}
