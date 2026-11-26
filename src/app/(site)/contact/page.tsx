import { Container, PageHero } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { brand, links } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's build something together" sub="Visit us, write to us or send your incubation request." img="/img/sriif2.png" />
      <Container className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl bg-surface p-5"><p className="font-semibold text-brand-dark">Address</p><p className="mt-1 text-sm text-slate-600">{brand.address}</p></div>
          <div className="rounded-xl bg-surface p-5"><p className="font-semibold text-brand-dark">Email</p><a className="text-sm text-brand underline" href={`mailto:${brand.email}`}>{brand.email}</a></div>
          <div className="rounded-xl bg-surface p-5"><p className="font-semibold text-brand-dark">Phone</p><a className="text-sm text-brand underline" href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a></div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/apply" variant="accent">Apply for Incubation</LinkButton>
            <LinkButton href={links.mentorForm} external variant="outline">Mentor form</LinkButton>
            <LinkButton href={links.regulatoryForm} external variant="outline">Regulatory Connect</LinkButton>
          </div>
        </div>
        <iframe title="SRIIF location map" className="h-96 w-full rounded-2xl border-0" loading="lazy" src="https://www.google.com/maps?q=Sri+Ramachandra+Institute+of+Higher+Education+and+Research+Porur+Chennai&output=embed" />
      </Container>
    </>
  );
}
