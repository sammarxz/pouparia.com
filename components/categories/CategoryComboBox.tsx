"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SuggestedCategory {
  name: string;
  icon: string;
}

interface CategoryComboBoxProps {
  options: SuggestedCategory[];
  value: string;
  onValueChangeClient: (value: string) => void;
  onCreateCategory?: (name: string, icon: string) => void;
  placeholder?: string;
  emptyText?: string;
}

export function CategoryComboBox({
  options = [],
  value = "",
  onValueChangeClient,
  onCreateCategory,
  placeholder = "Selecione uma opção...",
  emptyText = "Nenhuma opção encontrada.",
}: CategoryComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selectedEmoji, setSelectedEmoji] = React.useState("📋");

  const safeOptions = Array.isArray(options) ? options : [];
  const filteredOptions = safeOptions.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreateCategory = () => {
    if (search.trim()) {
      onCreateCategory?.(search.trim(), selectedEmoji);
      setSearch("");
      setSelectedEmoji("📋");
      setOpen(false);
    }
  };

  const handleSelectOption = (option: SuggestedCategory) => {
    onCreateCategory?.(option.name, option.icon);
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {search &&
              !filteredOptions.some(
                (opt) => opt.name.toLowerCase() === search.toLowerCase(),
              ) && (
                <CommandGroup heading="Criar nova categoria">
                  <CommandItem
                    value={search}
                    className="flex items-center gap-2"
                    onSelect={handleCreateCategory}
                  >
                    <div className="flex items-center flex-1">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar "{search}"
                    </div>
                  </CommandItem>
                  {filteredOptions.length > 0 && <CommandSeparator />}
                </CommandGroup>
              )}

            {filteredOptions.length > 0 ? (
              <CommandGroup heading="Sugestões">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.name}
                    value={option.name}
                    onSelect={() => handleSelectOption(option)}
                    className="flex items-center gap-2"
                  >
                    <span className="flex items-center gap-2 flex-1">
                      <Check
                        className={cn(
                          "h-4 w-4",
                          value === option.name ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span>{option.icon}</span>
                      {option.name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              search && <CommandEmpty>{emptyText}</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
