"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   BUTTON                                   */
/* -------------------------------------------------------------------------- */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "glow" | "amber" | "emerald" | "secondary";
  size?: "default" | "sm" | "lg" | "icon" | "xl";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer",
          // Sizes
          size === "default" && "h-10 py-2 px-4 rounded-xl text-sm gap-2",
          size === "sm" && "h-8 px-3 rounded-lg text-xs gap-1.5",
          size === "lg" && "h-12 px-6 rounded-xl text-base gap-2.5",
          size === "xl" && "h-14 px-8 rounded-2xl text-lg font-semibold gap-3 shadow-lg",
          size === "icon" && "h-10 w-10 rounded-xl",

          // Variants
          variant === "default" &&
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 border border-primary/20",
          variant === "outline" &&
            "border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground shadow-sm",
          variant === "ghost" &&
            "hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground/80 hover:text-foreground",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/20",
          variant === "glow" &&
            "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110",
          variant === "amber" &&
            "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110",
          variant === "emerald" &&
            "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:brightness-110",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

/* -------------------------------------------------------------------------- */
/*                                    CARD                                    */
/* -------------------------------------------------------------------------- */
export const Card = ({
  className,
  glass = false,
  glow = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glass?: boolean; glow?: boolean }) => (
  <div
    className={cn(
      "rounded-2xl border transition-all duration-300",
      glass
        ? "border-white/10 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-xl"
        : "border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-md",
      glow && "hover:border-primary/50 hover:shadow-primary/10 hover:shadow-2xl",
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-bold leading-none tracking-tight text-foreground", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
);

/* -------------------------------------------------------------------------- */
/*                                    BADGE                                   */
/* -------------------------------------------------------------------------- */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "purple" | "cyan" | "live";
  pulse?: boolean;
}

export const Badge = ({ className, variant = "default", pulse = false, children, ...props }: BadgeProps) => (
  <div
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors select-none",
      variant === "default" && "bg-primary/15 text-primary border border-primary/30",
      variant === "secondary" && "bg-secondary text-secondary-foreground border border-border/50",
      variant === "destructive" && "bg-destructive/15 text-destructive border border-destructive/30",
      variant === "outline" && "border border-slate-300 dark:border-slate-700 text-foreground/80 bg-white/40 dark:bg-slate-900/40",
      variant === "success" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
      variant === "warning" && "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
      variant === "purple" && "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30",
      variant === "cyan" && "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30",
      variant === "live" && "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 animate-pulse font-mono tracking-wider",
      className
    )}
    {...props}
  >
    {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />}
    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                    INPUT                                   */
/* -------------------------------------------------------------------------- */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-3.5 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/* -------------------------------------------------------------------------- */
/*                                    SELECT                                  */
/* -------------------------------------------------------------------------- */
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md px-3.5 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
