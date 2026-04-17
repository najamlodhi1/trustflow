"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ open, onClose, title, children, size = "md", className }: ModalProps) {
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => firstFocusRef.current?.focus(), 10);
    } else {
      prevFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className={cn(
              "relative w-full rounded-[var(--radius-xl)] bg-bg-elevated border border-[var(--border-default)] shadow-[var(--shadow-md)] overflow-hidden",
              sizeClasses[size],
              className
            )}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
                <h2 id="modal-title" className="text-base font-semibold text-text-primary">
                  {title}
                </h2>
                <Button
                  ref={firstFocusRef}
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!title && (
              <Button
                ref={firstFocusRef}
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 z-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
