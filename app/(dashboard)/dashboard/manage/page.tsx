import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CategoryList } from "@/components/categories/CategoriesList";
import { CurrencyCombobox } from "@/components/currency/CurrencyCombobox";

export default function ManagePage() {
  return (
    <div className="container flex flex-col gap-6 mb-8 md:mb-0 md:py-8">
      <p className="text-3xl font-bold">Manage</p>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Change the currency of your transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyCombobox />
          </CardContent>
        </Card>
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </div>
  );
}
