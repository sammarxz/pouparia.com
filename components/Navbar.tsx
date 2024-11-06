"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Logo } from "./Logo";

import { Button, buttonVariants } from "./ui/button";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Bolt, LayoutDashboard, Menu, Wallet } from "lucide-react";

const items = [
  {
    label: "Dashboard",
    link: "/dashboard",
    icon: <LayoutDashboard absoluteStrokeWidth />,
  },
  {
    label: "Transactions",
    link: "/dashboard/transactions",
    icon: <Wallet absoluteStrokeWidth />,
  },
  {
    label: "Manage",
    link: "/dashboard/manage",
    icon: <Bolt absoluteStrokeWidth />,
  },
] as const;

export function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full block border-separate bg-background md:hidden">
      <nav className="flex items-center justify-between">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="max-w-[400px] sm:w-[540px] p-0"
              side="left"
            >
              <div className="py-6 px-4 border-b">
                <Logo />
              </div>
              <div className="flex flex-col gap-1 divide-y mt-1">
                {items.map((item) => (
                  <NavbarItem
                    key={item.label}
                    item={item}
                    handleClick={() => setIsOpen((prev) => !prev)}
                  />
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden md:block">
      <nav className="flex items-center justify-between relative">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {items.map((item) => (
            <NavbarItem key={item.label} item={item} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">
            Hello, <strong>Samuel</strong>
          </span>
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

function NavbarItem({
  item,
  handleClick,
}: {
  item: (typeof items)[number];
  handleClick?: () => void;
}) {
  const { label, link, icon } = item;

  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "w-full justify-start text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (handleClick) handleClick();
        }}
      >
        {icon}
        {label}
      </Link>
    </div>
  );
}
