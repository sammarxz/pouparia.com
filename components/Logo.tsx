import Link from "next/link";
import { PiggyBank } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1">
      <PiggyBank
        size={28}
        absoluteStrokeWidth
        className="stroke stroke-green-400 stroke-[1.5]"
      />
      <span className="text-xl font-semibold tracking-tighter -mt-1 text-green-950">
        pouparia.com
      </span>
    </Link>
  );
}
