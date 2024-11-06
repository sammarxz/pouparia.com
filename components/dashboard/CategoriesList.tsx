"use client";

import { TransactionType } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { SkeletonWrapper } from "../common/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ArrowDownLeft, ArrowUpRight, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Category } from "@prisma/client";
import { CategoryDialog } from "../categories/CategoryDialog";
import { Badge } from "../ui/badge";

export function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center space-y-0">
          <CardTitle className="flex items-center gap-1">
            <span className="flex items-center gap-2">
              {type === "income" ? (
                <>
                  <ArrowDownLeft className="text-green-500" /> Income
                </>
              ) : (
                <>
                  <ArrowUpRight className="text-red-500" /> Expense
                </>
              )}
            </span>
            Categories
          </CardTitle>
          <CategoryDialog
            type={type}
            trigger={
              <Button variant="outline">
                <Plus className="w-4 h-4" /> Create
              </Button>
            }
          />
        </CardHeader>
        <Separator />
        {!dataAvailable ? (
          <div className="flex flex-col items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">
              No categories found. Create one!
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 px-6 py-8">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <CategoryDialog
      category={category}
      type={category.type as TransactionType}
      trigger={
        <Badge
          variant="outline"
          className="text-sm rounded-full flex gap-2 items-center"
        >
          <span>{category.icon}</span> {category.name}
        </Badge>
      }
    />
  );
}
