import { slugify } from "@/utils/slugify";

export type MenuCategory =
  | "All"
  | "Rice"
  | "Swallow"
  | "Intercontinental"
  | "Soups"
  | "Protein"
  | "Others";

export type MenuBadge = {
  label: MenuCategory;
  icon?: string;
};

export type MenuCardItem = {
  id: string;
  name: string;
  category: Exclude<MenuCategory, "All">;
  image: string;
  itemsLeft: number;
};

export const menuBadges: MenuBadge[] = [
  { label: "All" },
  { label: "Rice", icon: "🍚" },
  { label: "Swallow", icon: "🥣" },
  { label: "Intercontinental", icon: "🍝" },
  { label: "Soups", icon: "🍲" },
  { label: "Protein", icon: "🍗" },
  { label: "Others" },
];

const heroImages = [
  "/hero/heroImage1.png",
  "/hero/heroImage2.png",
  "/hero/heroImage3.png",
];

const itemsLeftPattern = [12, 9, 15, 7, 18, 11, 6, 14, 10, 8, 16, 5, 13, 19, 4];

const categoryItems: Record<Exclude<MenuCategory, "All">, string[]> = {
  Rice: [
    "Party Jollof Rice",
    "Coconut Rice",
    "Fried Rice",
    "Ofada Rice",
    "Native Rice",
    "Palm Oil Rice",
    "Basmati Jollof",
    "Seafood Rice",
    "Chicken Fried Rice",
    "Vegetable Rice",
    "Beef Jollof Rice",
    "Goat Meat Rice",
    "Asun Rice Bowl",
    "Prawn Fried Rice",
    "Abirikky Special Rice",
  ],
  Swallow: [
    "Pounded Yam",
    "Eba",
    "Amala",
    "Semo",
    "Wheat Swallow",
    "Fufu",
    "Oat Swallow",
    "Plantain Swallow",
    "Tuwo Shinkafa",
    "Starch",
    "Yellow Garri Eba",
    "White Amala",
    "Cassava Fufu",
    "Corn Meal Swallow",
    "Signature Swallow Platter",
  ],
  Intercontinental: [
    "Creamy Pasta",
    "Chicken Alfredo",
    "Grilled Fish Fillet",
    "Spaghetti Bolognese",
    "Stir Fry Noodles",
    "Roasted Potatoes",
    "Garden Salad",
    "Chicken Shawarma",
    "Beef Burger",
    "Seafood Pasta",
    "Grilled Chicken Breast",
    "Mashed Potatoes",
    "Caesar Salad",
    "Prawn Linguine",
    "Continental Breakfast Plate",
  ],
  Soups: [
    "Egusi Soup",
    "Efo Riro",
    "Afang Soup",
    "Edikang Ikong",
    "Ogbono Soup",
    "Bitterleaf Soup",
    "Okra Soup",
    "Oha Soup",
    "Banga Soup",
    "Nsala Soup",
    "Seafood Okra",
    "Gbegiri and Ewedu",
    "Vegetable Soup",
    "Uziza Soup",
    "Abirikky Native Soup",
  ],
  Protein: [
    "Peppered Chicken",
    "Grilled Turkey",
    "Asun",
    "Suya Beef",
    "Fried Fish",
    "Peppered Snail",
    "Goat Meat",
    "Barbecue Chicken",
    "Prawn Skewers",
    "Beef Kebabs",
    "Croaker Fish",
    "Chicken Wings",
    "Turkey Wings",
    "Spicy Gizzard",
    "Mixed Protein Platter",
  ],
  Others: [
    "Small Chops",
    "Moi Moi",
    "Akara Bites",
    "Plantain Cubes",
    "Yam Fries",
    "Peppered Ponmo",
    "Coleslaw",
    "Puff Puff",
    "Spring Rolls",
    "Samosa",
    "Dodo Gizzard",
    "Chapman Cup",
    "Fruit Platter",
    "Zobo Drink",
    "Catering Snack Box",
  ],
};

export const menuItems: MenuCardItem[] = Object.entries(categoryItems).flatMap(
  ([category, names], categoryIndex) =>
    names.map((name, itemIndex) => ({
      id: `${category.toLowerCase()}-${itemIndex + 1}`,
      name,
      category: category as Exclude<MenuCategory, "All">,
      image: heroImages[(categoryIndex + itemIndex) % heroImages.length],
      itemsLeft: itemsLeftPattern[(categoryIndex + itemIndex) % itemsLeftPattern.length],
    }))
);

export const menuItemsByCategory: Record<MenuCategory, MenuCardItem[]> = {
  All: menuItems,
  Rice: menuItems.filter((item) => item.category === "Rice"),
  Swallow: menuItems.filter((item) => item.category === "Swallow"),
  Intercontinental: menuItems.filter((item) => item.category === "Intercontinental"),
  Soups: menuItems.filter((item) => item.category === "Soups"),
  Protein: menuItems.filter((item) => item.category === "Protein"),
  Others: menuItems.filter((item) => item.category === "Others"),
};

export const menuItemsBySlug: Record<string, MenuCardItem> = menuItems.reduce(
  (itemsBySlug, item) => {
    itemsBySlug[slugify(item.name)] = item;
    return itemsBySlug;
  },
  {} as Record<string, MenuCardItem>,
);
