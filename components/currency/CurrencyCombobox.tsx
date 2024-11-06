"use client";

import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserSettings } from "@prisma/client";
import { currencies } from "@/config/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkeletonWrapper } from "../common/SkeletonWrapper";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";

interface CurrencyComboboxProps {
  defaultCurrency?: (typeof currencies)[number];
  className?: string;
  onCurrencyChange?: (currency: (typeof currencies)[number]) => void;
}

export function CurrencyCombobox({
  defaultCurrency = currencies[0],
  className,
  onCurrencyChange,
}: CurrencyComboboxProps) {
  const [currency, setCurrency] =
    useState<(typeof currencies)[number]>(defaultCurrency);

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success("Moeda definida com sucesso!", {
        id: "update-currency",
      });

      const updatedCurrency = currencies.find((c) => c.value === data.currency);
      if (updatedCurrency) {
        setCurrency(updatedCurrency);
        onCurrencyChange?.(updatedCurrency);
      }
    },
    onError: () => {
      toast.error("Algo de errado não está certo", {
        id: "update-currency",
      });
    },
  });

  useEffect(() => {
    if (!userSettings.data) return;

    const userCurrency = currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );

    if (userCurrency) {
      setCurrency(userCurrency);
      onCurrencyChange?.(userCurrency);
    }
  }, [userSettings.data, onCurrencyChange]);

  const selectCurrency = useCallback(
    (currencyValue: string) => {
      const selectedCurrency = currencies.find(
        (c) => c.value === currencyValue
      );

      if (!selectedCurrency) {
        toast.error("Por favor, selecione uma moeda");
        return;
      }

      toast.loading("Atualizando moeda...", {
        id: "update-currency",
      });

      mutation.mutate(selectedCurrency.value);
    },
    [mutation]
  );

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Select
        value={currency?.value}
        onValueChange={selectCurrency}
        disabled={mutation.isPending}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Selecione sua moeda" />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((curr) => (
            <SelectItem key={curr.value} value={curr.value}>
              {curr.symbol} - {curr.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </SkeletonWrapper>
  );
}
