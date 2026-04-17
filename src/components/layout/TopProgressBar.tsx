"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div key={animKey} className="animate-progress-bar" />
    </div>
  );
}
