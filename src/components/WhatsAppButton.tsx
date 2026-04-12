
"use client"

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const handleSupport = () => {
    // Corrected WhatsApp number as per user request
    window.open("https://wa.me/96181438747", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleSupport}
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg flex items-center justify-center p-0 animate-bounce"
        aria-label="Contact support on WhatsApp"
      >
        <MessageCircle className="h-8 w-8 text-white fill-current" />
      </Button>
    </div>
  );
};
