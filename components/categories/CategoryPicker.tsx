"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category, CategoryInput } from "@/types/category";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { TransactionType } from "@/types/transaction";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { cn } from "@/lib/utils";

interface CategoryPickerProps {
  type: TransactionType;
}

export function CategoryPicker({ type }: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory: CategoryInput | null = categoriesQuery.data?.find(
    (category: CategoryInput) => category.name === value,
  );

  const filteredCategories = categoriesQuery.data?.filter(
    (category: Category) =>
      category.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSearchChange = (newValue: string) => {
    setSearch(newValue);
  };

  // Função para lidar com a seleção de categoria após criação
  const handleCategoryCreated = (category: Category) => {
    setValue(category.name);
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full items-center justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            <>
              <span>Select a category</span>
              <ChevronsUpDown />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full min-w-[375px]">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput
            placeholder="buscar categorias..."
            value={search}
            onValueChange={handleSearchChange}
          />
          {search && filteredCategories?.length === 0 && (
            <CreateCategoryDialog
              type={type}
              defaultValue={search}
              onCategoryCreated={handleCategoryCreated}
            />
          )}
          <CommandEmpty className="px-4 py-2">
            <p className="text-muted-foreground text-sm">Category not found</p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoriesQuery.data?.map((category: Category) => (
                <CommandItem
                  key={category.name}
                  onSelect={() => {
                    setValue(category.name);
                    setOpen(false);
                  }}
                >
                  <CategoryRow category={category} />
                  <Check
                    className={cn(
                      "mr-2 w-4 h-4 opacity-0",
                      value === category.name && "opacity-1",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CategoryRow({ category }: { category: CategoryInput }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
