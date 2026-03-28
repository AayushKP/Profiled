"use client";

import { LuminalTemplate } from "@/components/portfolio/templates/luminal";
import { dummyPortfolio } from "@/lib/dummy-data";

export default function LuminalPreviewPage() {
  return (
    <LuminalTemplate
      portfolio={dummyPortfolio}
      isPreview={true}
      isLoggedIn={false}
    />
  );
}
