import { Suspense } from "react";
import { EventDetail } from "./detail";

export const metadata = { title: "Event" };

export default function Page() {
  return <Suspense><EventDetail /></Suspense>;
}
