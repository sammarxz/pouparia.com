export interface CategoryInput {
  name: string;
  icon: string;
  type: "income" | "expense";
}

export interface Category extends CategoryInput {
  createdAt: Date;
  userId: string;
}

export interface SuggestedCategory {
  name: string;
  icon: string;
}
