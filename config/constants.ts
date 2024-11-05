import { SuggestedCategory } from "@/types/category";

export const MaxDateRange = 90;

export const defaultIncomeCategories = [
  { name: "Salário", icon: "💰" },
  { name: "Freelance", icon: "💻" },
  { name: "Investimentos", icon: "📈" },
  { name: "Aluguel", icon: "🏠" },
  { name: "Dividendos", icon: "💵" },
  { name: "Presente", icon: "🎁" },
  { name: "Outros", icon: "📋" },
];

export const defaultExpenseCategories = [
  { name: "Alimentação", icon: "🍽️" },
  { name: "Mercado", icon: "🛒" },
  { name: "Transporte", icon: "🚗" },
  { name: "Moradia", icon: "🏠" },
  { name: "Saúde", icon: "⚕️" },
  { name: "Educação", icon: "📚" },
  { name: "Lazer", icon: "🎮" },
  { name: "Roupas", icon: "👕" },
  { name: "Utilidades", icon: "💡" },
  { name: "Internet", icon: "📶" },
  { name: "Streaming", icon: "📺" },
  { name: "Outros", icon: "📋" },
];

export const currencies = [
  { label: "Real Brasileiro", value: "BRL", symbol: "R$" },
  { label: "Dólar Americano", value: "USD", symbol: "$" },
  { label: "Euro", value: "EUR", symbol: "€" },
] as const;

export const suggestedIncomeCategories: SuggestedCategory[] = [
  { name: "Salário", icon: "💰" },
  { name: "Freelance", icon: "💻" },
  { name: "Investimentos", icon: "📈" },
  { name: "Aluguel", icon: "🏠" },
  { name: "Dividendos", icon: "💵" },
  { name: "Presente", icon: "🎁" },
  { name: "Bônus", icon: "🎯" },
  { name: "Comissão", icon: "💎" },
  { name: "Reembolso", icon: "💱" },
  { name: "Prêmio", icon: "🏆" },
  { name: "Venda", icon: "🏷️" },
];

export const suggestedExpenseCategories: SuggestedCategory[] = [
  { name: "Alimentação", icon: "🍽️" },
  { name: "Mercado", icon: "🛒" },
  { name: "Transporte", icon: "🚗" },
  { name: "Moradia", icon: "🏠" },
  { name: "Aluguel", icon: "🏢" },
  { name: "Condomínio", icon: "🏘️" },
  { name: "IPTU", icon: "📑" },
  { name: "Água", icon: "💧" },
  { name: "Luz", icon: "💡" },
  { name: "Gás", icon: "🔥" },
  { name: "Internet", icon: "📶" },
  { name: "Telefone", icon: "☎️" },
  { name: "Celular", icon: "📱" },
  { name: "Saúde", icon: "⚕️" },
  { name: "Plano de Saúde", icon: "🏥" },
  { name: "Remédios", icon: "💊" },
  { name: "Academia", icon: "🏋️‍♂️" },
  { name: "Educação", icon: "📚" },
  { name: "Cursos", icon: "👨‍🎓" },
  { name: "Material Escolar", icon: "✏️" },
  { name: "Lazer", icon: "🎮" },
  { name: "Viagem", icon: "✈️" },
  { name: "Cinema", icon: "🎬" },
  { name: "Teatro", icon: "🎭" },
  { name: "Restaurante", icon: "🍽️" },
  { name: "Roupas", icon: "👕" },
  { name: "Calçados", icon: "👞" },
  { name: "Acessórios", icon: "👜" },
  { name: "Streaming", icon: "📺" },
  { name: "Netflix", icon: "🎬" },
  { name: "Spotify", icon: "🎵" },
  { name: "Prime Video", icon: "🎥" },
  { name: "Disney+", icon: "🎪" },
  { name: "HBO Max", icon: "🎦" },
  { name: "Manutenção", icon: "🔧" },
  { name: "Limpeza", icon: "🧹" },
  { name: "Presente", icon: "🎁" },
  { name: "Pet", icon: "🐾" },
  { name: "Seguro", icon: "🔒" },
];
