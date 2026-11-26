import { PrintDoc } from "./doc";

// Static export needs every document type listed up front.
export function generateStaticParams() {
  return ["profile", "offer", "agreement", "invoice", "receipt", "quarterly", "annual", "exit", "impact"].map((kind) => ({ kind }));
}


export default function Page() {
  return <PrintDoc />;
}
