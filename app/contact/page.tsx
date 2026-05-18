import type { Metadata } from "next";

import { ContactPageView } from "@/views/contact/ContactPageView";

export const metadata: Metadata = {
  title: "Contact | Abirikky",
  description:
    "Contact Abirikky for catering, events, office meals, and custom menu planning.",
};

export default function ContactPage() {
  return <ContactPageView />;
}
