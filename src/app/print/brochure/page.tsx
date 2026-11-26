import { Suspense } from "react";
import { Brochure } from "./brochure";

export const metadata = { title: "Event brochure" };

export default function Page() {
  return <Suspense><Brochure /></Suspense>;
}
