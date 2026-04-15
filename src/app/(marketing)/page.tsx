// The landing page lives at app/page.tsx to avoid a duplicate "/" route.
// The (marketing) group layout is used for marketing sub-pages (/about, /pricing, etc.)
import { notFound } from "next/navigation";
export default function MarketingGroupIndex() {
  notFound();
}
