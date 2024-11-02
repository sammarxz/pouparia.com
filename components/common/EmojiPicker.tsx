"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  onChange: (emoji: string) => void;
  value?: string;
  className?: string;
}

export function EmojiPicker({
  onChange,
  value = "📋",
  className,
}: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false);

  const onEmojiSelect = (emoji: any) => {
    onChange(emoji.native);
    setOpen(false); // Fecha o popover após selecionar um emoji
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-8 h-8 bg-transparent border-none shadow-none p-0 flex items-center justify-center",
            className,
          )}
        >
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 overflow-hidden"
        side="right"
        align="start"
      >
        <Picker
          data={data}
          onEmojiSelect={onEmojiSelect}
          locale="pt"
          previewPosition="none"
          skinTonePosition="none"
          searchPosition="none"
          navPosition="none"
          perLine={8}
          theme="light"
          set="native"
          categories={[
            "frequent",
            "objects",
            "nature",
            "food-drink",
            "activities",
            "travel-places",
          ]}
        />
      </PopoverContent>
    </Popover>
  );
}
