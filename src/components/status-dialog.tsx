"use client";

import { AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/moving-border";

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "error" | "success";
  title: string;
  description?: string;
  onFreshSearch: () => void;
}

export function StatusDialog({
  open,
  onOpenChange,
  type,
  title,
  description,
  onFreshSearch,
}: StatusDialogProps) {
  const handleFreshSearch = () => {
    onOpenChange(false);
    onFreshSearch();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-[var(--border)]">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            {type === "error" ? (
              <div className="rounded-full bg-[var(--error)]/20 p-4">
                <AlertCircle className="h-12 w-12 text-[var(--error)]" />
              </div>
            ) : (
              <div className="rounded-full bg-[var(--success)]/20 p-4">
                <CheckCircle className="h-12 w-12 text-[var(--success)]" />
              </div>
            )}
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center">{description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
            <Button onClick={handleFreshSearch} className="w-full sm:w-auto rounded-button">
              Fresh Search
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
