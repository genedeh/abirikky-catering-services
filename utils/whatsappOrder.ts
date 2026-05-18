import type { BasketItem } from "@/redux/basket/basketSlice";
import { slugify } from "@/utils/slugify";

export const WHATSAPP_ORDER_PHONE = "2348028335011";
export const PENDING_WHATSAPP_ORDER_KEY = "pending_whatsapp_order";

export type PendingWhatsAppOrder = {
  cartItems: BasketItem[];
  createdAt: string;
  orderMessage: string;
  preferredDateTime: string;
  whatsappUrl: string;
};

type BuildWhatsAppOrderInput = {
  cartItems: BasketItem[];
  origin: string;
  preferredDateTime: string;
};

export type BuildWhatsAppContactInput = {
  email: string;
  eventDate: string;
  eventType: string;
  guestCount: string;
  message: string;
  name: string;
  origin: string;
  phone: string;
  serviceInterest: string;
};

export function normalizeWhatsAppPhone(phoneNumber: string) {
  return phoneNumber.replace(/[+\s().-]/g, "");
}

export function toAbsoluteUrl(pathOrUrl: string, origin: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}

export function getMenuSlug(itemName: string) {
  return slugify(itemName);
}

export function getMenuDetailUrl(itemName: string, origin: string) {
  return `${origin}/menu/${getMenuSlug(itemName)}`;
}

export function formatPreferredDateTime(dateTimeValue: string) {
  const date = new Date(dateTimeValue);

  if (Number.isNaN(date.getTime())) {
    return dateTimeValue;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export function buildWhatsAppOrder({
  cartItems,
  origin,
  preferredDateTime,
}: BuildWhatsAppOrderInput): PendingWhatsAppOrder {
  const normalizedPhone = normalizeWhatsAppPhone(WHATSAPP_ORDER_PHONE);
  const formattedDateTime = formatPreferredDateTime(preferredDateTime);
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const itemLines = cartItems
    .map((item, index) => {
      const slug = getMenuSlug(item.name);
      const imageUrl = toAbsoluteUrl(item.image, origin);
      const menuUrl = getMenuDetailUrl(item.name, origin);

      return `${index + 1}. ${item.name}
   Menu ID: ${item.id}
   Slug: ${slug}
   Category: ${item.category}
   Quantity: ${item.quantity}
   Image: ${imageUrl}
   Menu Link: ${menuUrl}`;
    })
    .join("\n\n");

  const orderMessage = `Hello, I would like to place an order.

Order Summary:

${itemLines}

Total Items: ${totalQuantity}

Preferred Date/Time:
${formattedDateTime}

Please confirm availability.`;

  return {
    cartItems,
    createdAt: new Date().toISOString(),
    orderMessage,
    preferredDateTime: formattedDateTime,
    whatsappUrl: `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
      orderMessage,
    )}`,
  };
}

export function buildWhatsAppContactMessage({
  email,
  eventDate,
  eventType,
  guestCount,
  message,
  name,
  origin,
  phone,
  serviceInterest,
}: BuildWhatsAppContactInput) {
  const normalizedPhone = normalizeWhatsAppPhone(WHATSAPP_ORDER_PHONE);
  const contactMessage = `Hello Abirikky, I would like to make an enquiry.

Contact Request:

Name:
${name}

Phone:
${phone}

Email:
${email || "Not provided"}

Service Interest:
${serviceInterest}

Event Type:
${eventType || "Not specified"}

Guest Count:
${guestCount || "Not specified"}

Preferred Date:
${eventDate || "Not specified"}

Message:
${message}

Source:
${origin}/contact

Please get back to me with availability and next steps.`;

  return {
    message: contactMessage,
    whatsappUrl: `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
      contactMessage,
    )}`,
  };
}

export function readPendingWhatsAppOrder(): PendingWhatsAppOrder | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedOrder = window.localStorage.getItem(PENDING_WHATSAPP_ORDER_KEY);
    return storedOrder ? (JSON.parse(storedOrder) as PendingWhatsAppOrder) : null;
  } catch {
    return null;
  }
}

export function writePendingWhatsAppOrder(order: PendingWhatsAppOrder) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      PENDING_WHATSAPP_ORDER_KEY,
      JSON.stringify(order),
    );
  } catch {
    // Local storage can fail in private browsing or quota-limited contexts.
  }
}

export function clearPendingWhatsAppOrder() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(PENDING_WHATSAPP_ORDER_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}
