import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { Container, PageHero, SocialBadges } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { INQUIRY_TYPES } from "@/lib/seed";
import { brand, maps } from "@/lib/site";

export const metadata = { title: "Contact Us" };

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact Us" title="Let's build something together" sub="Send us a message and it reaches the right desk: incubation, partnerships, facilities or the main office." />
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid content-start gap-4">
          <div className="flex gap-4 rounded-xl bg-surface p-5"><MapPin size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden /><div><p className="font-semibold text-brand-dark">Address</p><p className="mt-1 text-sm text-slate-600">{brand.address}</p></div></div>
          <div className="flex gap-4 rounded-xl bg-surface p-5"><Mail size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden /><div><p className="font-semibold text-brand-dark">Email</p><a className="text-sm text-brand underline" href={`mailto:${brand.email}`}>{brand.email}</a></div></div>
          <div className="flex gap-4 rounded-xl bg-surface p-5"><Phone size={22} className="mt-0.5 shrink-0 text-brand" aria-hidden /><div><p className="font-semibold text-brand-dark">Phone</p><a className="text-sm text-brand underline" href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a></div></div>
          <div className="rounded-xl bg-surface p-5">
            <p className="mb-3 font-semibold text-brand-dark">Which desk handles what</p>
            <ul className="grid gap-1.5 text-sm text-slate-600">{INQUIRY_TYPES.map((t) => <li key={t.type}><b className="text-slate-800">{t.type}</b> → {t.desk}</li>)}</ul>
          </div>
          <div><p className="mb-2 text-sm font-semibold text-brand-dark">Follow SRIIF</p><SocialBadges /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="display text-3xl text-brand-dark">Send a message</h2>
          <div className="mt-6"><InquiryForm kind="Contact" types={INQUIRY_TYPES.map((t) => t.type)} /></div>
        </div>
      </Container>
      <section aria-labelledby="map-h" className="border-t border-slate-200 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <h2 id="map-h" className="display text-3xl text-brand-dark md:text-4xl">Find us on campus</h2>
            <div className="flex flex-wrap gap-2">
              <LinkButton href={maps.directions} external variant="accent" className="min-h-11"><Navigation size={18} aria-hidden />Get directions</LinkButton>
              <LinkButton href={maps.open} external variant="outline" className="min-h-11 bg-white">Open in Google Maps</LinkButton>
            </div>
          </div>
          <iframe title="Map: SRIIF at Sri Ramachandra Institute, Porur, Chennai" className="h-[28rem] w-full rounded-2xl border border-slate-200" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={maps.embed} />
        </div>
      </section>
    </>
  );
}
