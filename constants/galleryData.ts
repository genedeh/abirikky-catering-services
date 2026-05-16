export type GalleryItem = {
  id: string;
  title: string;
  shape: "tall" | "wide" | "square" | "large" | "medium";
};

export const galleryItems: GalleryItem[] = [
  { id: "wedding-spread", title: "Wedding spread", shape: "tall" },
  { id: "jollof-table", title: "Jollof table", shape: "wide" },
  { id: "chef-plating", title: "Chef plating", shape: "square" },
  { id: "event-service", title: "Event service", shape: "large" },
  { id: "cocktail-bites", title: "Cocktail bites", shape: "medium" },
  { id: "corporate-lunch", title: "Corporate lunch", shape: "square" },
  { id: "buffet-line", title: "Buffet line", shape: "wide" },
  { id: "rice-selection", title: "Rice selection", shape: "medium" },
  { id: "soup-bowls", title: "Soup bowls", shape: "tall" },
  { id: "small-chops", title: "Small chops", shape: "square" },
  { id: "home-delivery", title: "Home delivery", shape: "medium" },
  { id: "celebration-table", title: "Celebration table", shape: "large" },
  { id: "intercontinental", title: "Intercontinental plates", shape: "wide" },
  { id: "dessert-corner", title: "Dessert corner", shape: "square" },
  { id: "family-service", title: "Family service", shape: "medium" },
  { id: "outdoor-catering", title: "Outdoor catering", shape: "tall" },
  { id: "premium-bowls", title: "Premium bowls", shape: "square" },
  { id: "party-packs", title: "Party packs", shape: "wide" },
];
