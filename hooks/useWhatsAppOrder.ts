"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { BasketItem } from "@/redux/basket/basketSlice";
import {
  buildWhatsAppOrder,
  clearPendingWhatsAppOrder,
  readPendingWhatsAppOrder,
  type PendingWhatsAppOrder,
  writePendingWhatsAppOrder,
} from "@/utils/whatsappOrder";

type UseWhatsAppOrderInput = {
  cartItems: BasketItem[];
  onOrderSent?: () => void;
};

export function useWhatsAppOrder({
  cartItems,
  onOrderSent,
}: UseWhatsAppOrderInput) {
  const [isDateTimeModalOpen, setIsDateTimeModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<PendingWhatsAppOrder | null>(
    null,
  );
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const hasCartItems = cartItems.length > 0;

  const sortedCartItems = useMemo(
    () => [...cartItems].sort((first, second) => first.name.localeCompare(second.name)),
    [cartItems],
  );

  useEffect(() => {
    const storedOrder = readPendingWhatsAppOrder();

    if (storedOrder) {
      setPendingOrder(storedOrder);
      setIsStatusModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const showStoredOrder = () => {
      const storedOrder = readPendingWhatsAppOrder();

      if (storedOrder) {
        setPendingOrder(storedOrder);
        setIsStatusModalOpen(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        showStoredOrder();
      }
    };

    window.addEventListener("focus", showStoredOrder);
    window.addEventListener("pageshow", showStoredOrder);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", showStoredOrder);
      window.removeEventListener("pageshow", showStoredOrder);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const startOrder = useCallback(() => {
    if (!hasCartItems) {
      return;
    }

    setHasCopied(false);
    setIsDateTimeModalOpen(true);
  }, [hasCartItems]);

  const openWhatsAppInNewTab = useCallback((whatsappUrl: string) => {
    const whatsappWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );

    if (!whatsappWindow) {
      const whatsappLink = document.createElement("a");
      whatsappLink.href = whatsappUrl;
      whatsappLink.target = "_blank";
      whatsappLink.rel = "noopener noreferrer";
      whatsappLink.style.display = "none";
      document.body.appendChild(whatsappLink);
      whatsappLink.click();
      whatsappLink.remove();
    }
  }, []);

  const confirmDateTime = useCallback(
    (preferredDateTime: string) => {
      if (!hasCartItems) {
        return;
      }

      setIsDateTimeModalOpen(false);
      setIsProcessing(true);

      const origin = window.location.origin;
      const order = buildWhatsAppOrder({
        cartItems: sortedCartItems,
        origin,
        preferredDateTime,
      });

      writePendingWhatsAppOrder(order);
      setPendingOrder(order);
      const whatsappWindow = window.open("about:blank", "_blank");

      window.setTimeout(() => {
        setIsProcessing(false);
        setIsStatusModalOpen(true);
        if (whatsappWindow) {
          whatsappWindow.location.href = order.whatsappUrl;
          return;
        }

        openWhatsAppInNewTab(order.whatsappUrl);
      }, 650);
    },
    [hasCartItems, openWhatsAppInNewTab, sortedCartItems],
  );

  const retryOrder = useCallback(() => {
    const storedOrder = pendingOrder ?? readPendingWhatsAppOrder();

    if (!storedOrder) {
      return;
    }

    setPendingOrder(storedOrder);
    openWhatsAppInNewTab(storedOrder.whatsappUrl);
  }, [openWhatsAppInNewTab, pendingOrder]);

  const markOrderSent = useCallback(() => {
    clearPendingWhatsAppOrder();
    onOrderSent?.();
    setPendingOrder(null);
    setIsStatusModalOpen(false);
    setHasCopied(false);
  }, [onOrderSent]);

  const copyOrderMessage = useCallback(async () => {
    const message = pendingOrder?.orderMessage;

    if (!message) {
      return;
    }

    try {
      await window.navigator.clipboard.writeText(message);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 1800);
    } catch {
      setHasCopied(false);
    }
  }, [pendingOrder]);

  return {
    cancelDateTime: () => setIsDateTimeModalOpen(false),
    confirmDateTime,
    copyOrderMessage,
    hasCopied,
    isDateTimeModalOpen,
    isProcessing,
    isStatusModalOpen,
    markOrderSent,
    pendingOrder,
    retryOrder,
    startOrder,
  };
}
