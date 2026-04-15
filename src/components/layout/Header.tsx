"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
}

export function Header({ title, actions, onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--border-subtle)] bg-bg-base/80 backdrop-blur-md px-4 md:px-6">
      {/* Mobile menu */}
      <button
        className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      {title && (
        <h1 className="text-sm font-semibold text-text-primary hidden md:block">{title}</h1>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {actions}

        <button
          className={cn(
            "flex items-center gap-2 h-9 px-3 rounded-[var(--radius-md)] text-sm text-text-tertiary border border-[var(--border-subtle)] bg-bg-elevated hover:border-[var(--border-default)] hover:text-text-secondary transition-all duration-150",
            "hidden md:flex"
          )}
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-1 text-[10px] px-1 py-0.5 rounded bg-bg-overlay text-text-tertiary font-mono">⌘K</kbd>
        </button>

        <button
          className="relative h-9 w-9 flex items-center justify-center rounded-[var(--radius-md)] text-text-tertiary hover:text-text-secondary hover:bg-bg-overlay transition-all duration-150"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
