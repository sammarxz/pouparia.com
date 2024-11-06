"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PlusCircle,
  MinusCircle,
  Wallet,
  BarChart3,
  Receipt,
  ChevronDown,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  currencies,
  defaultExpenseCategories,
  defaultIncomeCategories,
  suggestedExpenseCategories,
  suggestedIncomeCategories,
} from "@/config/constants";
import { UserSettings } from "@prisma/client";
import { SkeletonWrapper } from "../common/SkeletonWrapper";
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { CreateCategories } from "@/app/wizard/_actions/categories";
import { useRouter } from "next/navigation";
import { CategoryInput } from "@/types/category";
import { EmojiPicker } from "../common/EmojiPicker";
import { CategoryComboBox } from "../categories/CategoryComboBox";

interface Category {
  name: string;
  icon: string;
}

export function WizardForm() {
  const router = useRouter();

  const [currency, setCurrency] = useState<(typeof currencies)[number] | null>(
    currencies[0]
  );

  const [incomeCategories, setIncomeCategories] = useState<Category[]>(
    defaultIncomeCategories
  );
  const [expenseCategories, setExpenseCategories] = useState<Category[]>(
    defaultExpenseCategories
  );

  const [newCategory, setNewCategory] = useState<string>("");

  const [expandedSection, setExpandedSection] = useState<string>("currency");

  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  useEffect(() => {
    if (!userSettings.data) return;

    const userCurrency = currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );

    if (userCurrency) setCurrency(userCurrency);
  }, [userSettings.data]);

  const currencyMutation = useMutation({
    mutationFn: UpdateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success("Moeda definida com sucesso!", {
        id: "update-currency",
      });

      setCurrency(currencies.find((c) => c.value === data.currency) || null);
    },
    onError: () => {
      toast.error("Algo de errado não está certo", {
        id: "update-currency",
      });
    },
  });

  const setupMutation = useMutation({
    mutationFn: (data: {
      incomeCategories: CategoryInput[];
      expenseCategories: CategoryInput[];
    }) => CreateCategories(data),
    onSuccess: () => {
      toast.success("Configuração concluída com sucesso!");
      router.push("/dashboard");
    },
    onError: (err) => {
      toast.error("Erro ao salvar as configurações");
      console.log(err);
    },
  });

  const selectCurrency = useCallback(
    (currency: (typeof currencies)[number] | null) => {
      if (!currency) {
        toast.error("Por favor, selecione uma moeda");
        return;
      }

      toast.loading("Atualizando moeda...", {
        id: "update-currency",
      });

      currencyMutation.mutate(currency.value);
    },
    [currencyMutation]
  );

  const handleSelectCurrency = (currency: string) => {
    const selectedCurrency = currencies.find((c) => c.value === currency);
    if (selectedCurrency) selectCurrency(selectedCurrency);
  };

  const addCategory = (type: "income" | "expense"): void => {
    if (!newCategory.trim()) return;

    const newCategoryObj: Category = {
      name: newCategory.trim(),
      icon: "📋",
    };

    if (type === "income") {
      setIncomeCategories([...incomeCategories, newCategoryObj]);
    } else {
      setExpenseCategories([...expenseCategories, newCategoryObj]);
    }

    setNewCategory("");
  };

  const removeCategory = (
    type: "income" | "expense",
    categoryName: string
  ): void => {
    if (type === "income") {
      setIncomeCategories(
        incomeCategories.filter((c) => c.name !== categoryName)
      );
    } else {
      setExpenseCategories(
        expenseCategories.filter((c) => c.name !== categoryName)
      );
    }
  };

  const updateCategoryIcon = (
    type: "income" | "expense",
    categoryName: string,
    newIcon: string
  ) => {
    if (type === "income") {
      setIncomeCategories(
        incomeCategories.map((cat) =>
          cat.name === categoryName ? { ...cat, icon: newIcon } : cat
        )
      );
    } else {
      setExpenseCategories(
        expenseCategories.map((cat) =>
          cat.name === categoryName ? { ...cat, icon: newIcon } : cat
        )
      );
    }
  };

  const handleComplete = (): void => {
    if (!currency) {
      toast.error("Por favor, selecione uma moeda");
      return;
    }

    if (incomeCategories.length === 0 || expenseCategories.length === 0) {
      toast.error("Por favor, adicione pelo menos uma categorie da cada tipo");
      return;
    }

    setupMutation.mutate({
      incomeCategories: incomeCategories.map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        type: "income" as const,
      })),
      expenseCategories: expenseCategories.map((cat) => ({
        name: cat.name,
        icon: cat.icon,
        type: "expense" as const,
      })),
    });
  };

  const handleExpandSection = (sectionId: string): void => {
    setExpandedSection(expandedSection === sectionId ? "" : sectionId);
  };
  const handleCreateCategory = (
    type: "income" | "expense",
    name: string,
    icon: string
  ) => {
    // Verificar se a categoria já existe
    const categoryExists =
      type === "income"
        ? incomeCategories.some(
            (cat) => cat.name.toLowerCase() === name.toLowerCase()
          )
        : expenseCategories.some(
            (cat) => cat.name.toLowerCase() === name.toLowerCase()
          );

    if (categoryExists) {
      toast.error(`A categoria "${name}" já existe`);
      return;
    }

    const newCategoryObj: Category = {
      name,
      icon,
    };

    if (type === "income") {
      setIncomeCategories([...incomeCategories, newCategoryObj]);
    } else {
      setExpenseCategories([...expenseCategories, newCategoryObj]);
    }

    toast.success(`Categoria "${name}" criada com sucesso!`);
  };

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Section
              id="currency"
              icon={Wallet}
              title="Configure sua moeda"
              description="Defina a moeda que você utiliza"
              isExpanded={expandedSection === "currency"}
              onToggle={handleExpandSection}
            >
              <div className="space-y-4">
                <SkeletonWrapper isLoading={userSettings.isFetching}>
                  <Select
                    value={currency!.value}
                    onValueChange={handleSelectCurrency}
                  >
                    <SelectTrigger className="w-full">
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
              </div>
            </Section>

            <Section
              id="income"
              icon={BarChart3}
              title="Categorias de Receita"
              description="Configure suas fontes de renda"
              isExpanded={expandedSection === "income"}
              onToggle={handleExpandSection}
            >
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <CategoryComboBox
                      options={suggestedIncomeCategories}
                      value=""
                      onValueChangeClient={() => {}}
                      onCreateCategory={(name, icon) =>
                        handleCreateCategory("income", name, icon)
                      }
                      placeholder="Nova categoria de receita"
                      emptyText="Nenhuma categoria encontrada."
                    />
                  </div>
                  <Button onClick={() => addCategory("income")} size="icon">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {incomeCategories.map((category) => (
                    <Badge
                      key={category.name}
                      variant="secondary"
                      className="flex items-center gap-1 pl-0 pr-2 rounded-full"
                    >
                      <EmojiPicker
                        value={category.icon}
                        onChange={(emoji) =>
                          updateCategoryIcon("income", category.name, emoji)
                        }
                      />{" "}
                      {category.name}
                      <MinusCircle
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeCategory("income", category.name)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </Section>

            <Section
              id="expenses"
              icon={Receipt}
              title="Categorias de Despesa"
              description="Configure seus tipos de gastos"
              isExpanded={expandedSection === "expenses"}
              onToggle={handleExpandSection}
            >
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <CategoryComboBox
                      options={suggestedExpenseCategories}
                      value=""
                      onValueChangeClient={() => {}}
                      onCreateCategory={(name, icon) =>
                        handleCreateCategory("expense", name, icon)
                      }
                      placeholder="Nova categoria de despesa"
                      emptyText="Nenhuma categoria encontrada."
                    />
                  </div>
                  <Button onClick={() => addCategory("expense")} size="icon">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {expenseCategories.map((category) => (
                    <Badge
                      key={category.name}
                      variant="secondary"
                      className="flex items-center gap-1 pl-0 pr-2 rounded-full"
                    >
                      <EmojiPicker
                        value={category.icon}
                        onChange={(emoji) =>
                          updateCategoryIcon("expense", category.name, emoji)
                        }
                      />
                      {category.name}
                      <MinusCircle
                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeCategory("expense", category.name)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full"
            onClick={handleComplete}
            disabled={currencyMutation.isPending || setupMutation.isPending}
          >
            {setupMutation.isPending ? (
              "Configurando..."
            ) : (
              <>
                Começar a usar o Pouparia
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

interface SectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

function Section({
  id,
  icon: Icon,
  title,
  description,
  children,
  isExpanded,
  onToggle,
}: SectionProps) {
  return (
    <div className="border rounded-lg">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 flex flex-col items-start">
          <span className="font-medium">{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {isExpanded && <div className="px-4 pt-4 pb-6">{children}</div>}
    </div>
  );
}
