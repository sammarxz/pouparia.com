"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist");
      }

      toast.success("Welcome! Check your email for confirmation.");
      setEmail("");
      setIsSubscribed(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join waitlist"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center w-full p-3 mb-4 bg-white/50 border shadow-xs rounded-lg">
        <span className="group inline-flex items-center text-muted-foreground">
          <Check className="mr-2 size-4" /> Subscribed{" "}
        </span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-row w-full p-1 mb-4 bg-white border shadow-xs rounded-lg"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 shadow-none border-0 px-2 focus:ring-0 text-sm"
      />
      <Button type="submit" disabled={isLoading} className="relative">
        {isLoading ? (
          <span className="inline-flex items-center">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Joining...
          </span>
        ) : (
          "Join waitlist"
        )}
      </Button>
    </form>
  );
}
