import { FaqBlock, JourneyBlock } from "@/components/sections";
import { Container, PageHero } from "@/components/site-chrome";
import { LinkButton } from "@/components/ui";
import { brand, links } from "@/lib/site";
import { MailRequest } from "./mail-request";

export const metadata = { title: "Apply for Incubation" };

export default function Apply() {
  return (
    <>
      <PageHero eyebrow="Apply for Incubation" title="Tell us about your idea" sub="There is no self sign-up. Send your request by email or the application form. The SRIIF team reviews it, meets you, and if selected, onboards your whole team and creates your portal logins." img="/img/preincubation.jpg" />
      <Container className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-brand-dark">Option 1 · Email SRIIF</h2>
          <p className="mt-1 text-sm text-slate-600">Fill this and press the button. It opens your mail app with a ready email to <b>{brand.email}</b>.</p>
          <MailRequest />
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-brand-dark">Option 2 · Application form</h2>
            <p className="mt-1 text-sm text-slate-600">Prefer a form? Use the SRIIF Google form.</p>
            <LinkButton href={links.applyForm} external className="mt-4">Open application form</LinkButton>
          </div>
          <div className="rounded-2xl bg-surface p-6 text-sm text-slate-700">
            <h3 className="font-semibold text-brand-dark">What happens next</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>SRIIF admin logs your request and replies.</li>
              <li>Screening call and pitch to the selection panel.</li>
              <li>If selected, you sign the incubation agreement.</li>
              <li>Admin adds your startup and team members to the portal; each member gets a login.</li>
            </ol>
            <p className="mt-3 text-xs text-slate-500">Team members cannot be added by founders. Ask SRIIF admin to add or remove members.</p>
          </div>
        </div>
      </Container>
      <JourneyBlock />
      <FaqBlock />
    </>
  );
}
