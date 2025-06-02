"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ColorInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(({ className, value, onValueChange, onChange, ...props }, ref) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onValueChange?.(newValue);
    onChange?.(event);
  };

  return (
    <div className="relative">
      <input
        type="color"
        className={cn(
          "flex h-10 w-full cursor-pointer rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "p-1",
          className,
        )}
        value={value}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    </div>
  );
});
ColorInput.displayName = "ColorInput";

export { ColorInput };
