import { slugify } from "@/utils/slugify";

export type BlogCategory = string;

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug?: string;
  excerpt: string;
  content: string[];
  markdownContent?: string;
  author: string;
  publishedAt: string;
  readTime: string;
  commentCount: number;
  image: string;
  imageAlt?: string;
  featured: boolean;
  viewsTotal?: number;
};

export const blogCategories: BlogCategory[] = [
  "All",
  "Events",
  "Catering Tips",
  "Food Stories",
  "Behind the Kitchen",
  "Announcements",
];

const blogSeeds: Array<Omit<BlogPost, "id" | "slug" | "image">> = [
  {
    title: "How to Plan a Nigerian Wedding Menu Guests Remember",
    category: "Events",
    excerpt: "A practical guide to balancing rice, swallow, soups, grills, and late-night bites for a joyful celebration.",
    author: "Abirikky Events Team",
    publishedAt: "2026-05-10",
    readTime: "6 min read",
    commentCount: 18,
    featured: true,
    content: [
      "A memorable wedding menu starts with rhythm. Guests arrive at different times, energy rises in waves, and the food should support the full celebration from welcome drinks to the final dance.",
      "For Nigerian weddings, we like to anchor the spread with familiar favorites such as party jollof, fried rice, peppered chicken, and rich soups. Then we add lighter intercontinental trays for guests who want something easy to enjoy while moving around.",
      "The best menus also consider service flow. Bowls, trays, and stations should be arranged so guests can move quickly without crowding one point. That planning is what makes the food feel abundant and effortless.",
    ],
  },
  {
    title: "Small Chops Timing for Grand Celebrations",
    category: "Catering Tips",
    excerpt: "Serve small chops at the right moment so guests stay comfortable while the main meal is prepared.",
    author: "Chef Mide",
    publishedAt: "2026-05-08",
    readTime: "4 min read",
    commentCount: 9,
    featured: false,
    content: [
      "Small chops are not just a snack. They are the first promise of the event, and timing them well helps guests settle in while the kitchen prepares the heavier service.",
      "We usually recommend passing small chops after guests are seated and drinks are moving. Spring rolls, samosas, puff puff, and peppered bites should arrive warm, crisp, and portioned for easy sharing.",
      "When the event is long, a second light round can keep the room lively before dinner. It is a simple detail, but it changes the mood of the entire service.",
    ],
  },
  {
    title: "The Secret Behind Party Jollof Depth",
    category: "Food Stories",
    excerpt: "A smoky, layered jollof rice starts before the rice enters the pot.",
    author: "Abirikky Kitchen",
    publishedAt: "2026-05-05",
    readTime: "5 min read",
    commentCount: 24,
    featured: true,
    content: [
      "Party jollof gets its depth from patience. The stew base must cook down slowly until the tomatoes lose their sharpness and the pepper, onion, and spices become one rich body.",
      "Smoke matters too, but it should be controlled. The best result is warm and rounded, not harsh or burnt. Every pot needs attention, especially when cooking for a crowd.",
      "At Abirikky, we treat jollof as the center of the table. It carries memory, celebration, and a little friendly debate in every spoon.",
    ],
  },
  {
    title: "Behind the Kitchen: Prepping for 500 Guests",
    category: "Behind the Kitchen",
    excerpt: "What happens before the first plate leaves the kitchen for a large catering order.",
    author: "Operations Desk",
    publishedAt: "2026-05-02",
    readTime: "7 min read",
    commentCount: 15,
    featured: false,
    content: [
      "Large events are won before the cooking starts. We begin with counts, portions, dietary notes, delivery timing, serving tools, and a clear picture of the venue.",
      "Prep is separated into stations so every team member knows what they own. Proteins, soups, rice, salads, drinks, and service packs all move through different checkpoints.",
      "By the time guests arrive, the goal is calm. Good catering should feel generous and smooth, even when the work behind it is intense.",
    ],
  },
  {
    title: "New Bowl Service for Office Lunches",
    category: "Announcements",
    excerpt: "Our food-in-bowl service is designed for clean, quick, flavorful team lunches.",
    author: "Abirikky Team",
    publishedAt: "2026-04-30",
    readTime: "3 min read",
    commentCount: 6,
    featured: false,
    content: [
      "We are expanding our food-in-bowl service for offices and small teams that want clean portions without losing flavor.",
      "Each bowl can be built around rice, protein, vegetables, sauces, or lighter intercontinental options. It is easy to deliver, easy to serve, and easy to enjoy during a busy workday.",
      "This service is especially helpful for training days, meetings, and weekly team lunches where speed and consistency matter.",
    ],
  },
  {
    title: "Choosing Soups for Mixed Guest Lists",
    category: "Catering Tips",
    excerpt: "How to combine egusi, efo riro, okra, and lighter choices for broad appeal.",
    author: "Chef Mide",
    publishedAt: "2026-04-28",
    readTime: "5 min read",
    commentCount: 11,
    featured: false,
    content: [
      "Soup selection is about variety and confidence. Some guests want deep traditional flavors, while others prefer lighter textures or milder heat.",
      "A good spread might pair egusi with efo riro and okra, then add a seafood or vegetable option for guests who want something different.",
      "The swallow choices matter too. Pounded yam, eba, amala, and wheat should be planned around the soup texture and the guest profile.",
    ],
  },
];

const extraTitles = [
  ["Corporate Catering Without Boring Food", "Events"],
  ["How We Pack Home Delivery for Freshness", "Behind the Kitchen"],
  ["Why Protein Platters Need Balance", "Catering Tips"],
  ["The Story of Our Native Rice", "Food Stories"],
  ["Conference Meals That Keep People Focused", "Events"],
  ["New Weekend Family Trays Are Here", "Announcements"],
  ["How to Estimate Portions for Owambe", "Catering Tips"],
  ["Intercontinental Plates with Nigerian Warmth", "Food Stories"],
  ["Inside Our Sauce and Spice Prep", "Behind the Kitchen"],
  ["Planning Vegetarian Options for Parties", "Catering Tips"],
  ["Home Delivery Now Covers More Lagos Areas", "Announcements"],
  ["What Makes a Grand Celebration Flow", "Events"],
  ["Afang, Efo Riro, and the Joy of Greens", "Food Stories"],
  ["How We Keep Event Service Moving", "Behind the Kitchen"],
  ["Building a Menu Around Budget and Taste", "Catering Tips"],
  ["The Rise of Bowl Meals at Events", "Food Stories"],
  ["Holiday Catering Slots Open Soon", "Announcements"],
  ["Why Drinks Should Be Planned with Food", "Catering Tips"],
  ["From Kitchen Prep to Guest Applause", "Behind the Kitchen"],
  ["Catering for Kids and Family Tables", "Events"],
  ["The Beauty of Properly Peppered Chicken", "Food Stories"],
  ["How to Choose Between Buffet and Plated Service", "Catering Tips"],
  ["Our Approach to Clean Event Presentation", "Behind the Kitchen"],
  ["Introducing More Snack Box Options", "Announcements"],
] satisfies Array<[string, Exclude<BlogCategory, "All">]>;

const generatedPosts = extraTitles.map(([title, category], index) => ({
  title,
  category,
  excerpt: `Fresh notes from Abirikky on ${title.toLowerCase()}, prepared for hosts who care about flavor, timing, and generous service.`,
  author: index % 2 === 0 ? "Abirikky Team" : "Chef Mide",
  publishedAt: `2026-04-${String(27 - index).padStart(2, "0")}`,
  readTime: `${3 + (index % 5)} min read`,
  commentCount: 4 + ((index * 3) % 22),
  featured: index === 3 || index === 11,
  content: [
    "Every Abirikky service begins with a simple question: what should guests feel when the food arrives? That answer shapes the menu, portions, timing, and presentation.",
    "For us, good catering should feel thoughtful without feeling stiff. Nigerian favorites can sit beside intercontinental dishes when the flavors, textures, and serving style are planned with care.",
    "The best results come from early planning, honest guest counts, and a kitchen team that understands both celebration and comfort.",
  ],
}));

export const blogPosts: BlogPost[] = [...blogSeeds, ...generatedPosts].map(
  (post, index) => ({
    ...post,
    id: `blog-${index + 1}`,
    slug: slugify(post.title),
    image: `https://picsum.photos/seed/abirikky-blog-${index + 1}/900/640`,
  }),
);

export const blogPostsBySlug: Record<string, BlogPost> = blogPosts.reduce(
  (postsBySlug, post) => {
    postsBySlug[post.slug] = post;
    return postsBySlug;
  },
  {} as Record<string, BlogPost>,
);
