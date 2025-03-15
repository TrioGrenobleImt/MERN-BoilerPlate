"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRef, useState } from "react";

type PropsType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function TermsAndConditions({ open, setOpen }: PropsType) {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const scrollPercentage = content.scrollTop / (content.scrollHeight - content.clientHeight);
    if (scrollPercentage >= 0.99 && !hasReadToBottom) {
      setHasReadToBottom(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="space-y-0 text-left contents">
          <DialogTitle className="px-6 py-4 text-base border-b">Terms & Conditions</DialogTitle>
          <div ref={contentRef} onScroll={handleScroll} className="overflow-y-auto">
            <DialogDescription asChild>
              <div className="px-6 py-4">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  <div className="space-y-4">Enter your terms and conditions</div>
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
