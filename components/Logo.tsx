import { PiggyBank } from "lucide-react";

export function Logo() {
  return (
    <a href="" className="flex items-center gap-2">
      <PiggyBank className="stroke h-11 w-11 stroke-lime-400 stroke-[1.5]" />
      <span className="text-3xl font-semibold tracking-tighter">
        pouparia.com
      </span>
    </a>
  );
}
