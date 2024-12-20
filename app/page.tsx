import Image from "next/image";
import Link from "next/link";

import { FakeFinanceDashboardCard } from "@/components/landing/FakeFinanceDashboardCard";
import { WaitlistForm } from "@/components/landing/WaitListForm";

export default function LandingPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-24">
      <header className="flex flex-col gap-12 items-center text-center">
        <Image src="/logo.svg" width={54} height={54} alt="" className="" />
        <div className="flex flex-col gap-2">
          <h1 className="w-full pt-8 mx-auto mb-4 text-[28px] md:text-3xl">
            Pouparia{" "}
            <Image
              src="/logo.svg"
              width={48}
              height={48}
              alt="Pouparia Logo Symbol"
              className="inline w-8 md:w-auto scale-[0.9] rotate-[5deg]"
            />{" "}
            is a{" "}
            <em className="relative">
              <span className="border-b-2 border-gray-400 border-dotted">
                fully
              </span>
              <sup>*</sup>
              <span className="absolute w-40 md:w-64 text-xs text-left text-gray-400 left-2 -top-8 md:left-16 md:-top-7 -rotate-3">
                <sup>*</sup>
                your finances are secure
              </span>
            </em>{" "}
            open source OS for your personal finances{" "}
            <Image
              src="/icons/chart.svg"
              width={48}
              height={48}
              alt="Chart icon"
              className="inline w-8 md:w-auto"
            />{" "}
            Currently maintained by one developer{" "}
            <Link href="https://github.com/sammarxz">
              <Image
                src={"https://avatars.githubusercontent.com/u/19997815?v=4"}
                width={38}
                height={38}
                alt="Sam Marxz"
                className="inline max-w-10 md:w-auto rounded-full border"
              />
            </Link>{" "}
            who believes in the{" "}
            <Link
              href="https://github.com/sammarxz/pouparia.com"
              className="inline-flex md:w-auto px-2 py-1.5 h-[42px] w-[42px] shadow-[inset_0_-2px_5px_0_rgba(0,0,0,0.07)] bg-gray-100 rounded-md border-gray-200 items-center justify-center"
            >
              <Image
                src="/icons/github.svg"
                width={20}
                height={20}
                alt="Github Icon"
                className="w-5 h-5"
              />
            </Link>{" "}
            power of{" "}
            <span className="inline-block">community-driven development. </span>
            <Image
              src="/icons/discord.svg"
              width={45}
              height={45}
              alt="Discord Icon"
              className="inline w-8 md:w-auto"
            />
          </h1>
          <div className="mx-auto w-full max-w-[420px]">
            <WaitlistForm />
            <div className="w-full mx-auto flex space-x-2 items-center justify-center flex-col md:flex-row">
              <div className="flex -space-x-2 overflow-hidden p-2">
                <Image
                  src="/users/1694846673.png"
                  alt="user 1"
                  width={38}
                  height={38}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-200 hover:scale-105 tranform duration-100"
                />
                <Image
                  src="/users/1694846691.png"
                  alt="user 2"
                  width={38}
                  height={38}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-200 hover:scale-105 tranform duration-100"
                />
                <Image
                  src="/users/1694846704.png"
                  alt="user 3"
                  width={38}
                  height={38}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-gray-200 hover:scale-105 tranform duration-100"
                />
              </div>
              <p className="text-sm text-neutral-600 font-medium">
                Join 12,500 + others on the waitlist
              </p>
            </div>
          </div>
        </div>
        <div className="relative bg-neutral-100 border h-fit w-full p-4 rounded-sm shadow-md">
          <FakeFinanceDashboardCard />
        </div>
      </header>
    </main>
  );
}
