"use client";

import type React from "react";

import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface InputFileProps {
  label?: string;
  buttonText?: string;
  id?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function InputFile({
  label,
  buttonText = "Choisir un fichier",
  id = "picture",
  disabled = false,
  onChange,
  className = "",
}: InputFileProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center gap-2">
        <Button type="button" onClick={handleClick} variant="outline" className="w-full" disabled={disabled}>
          {buttonText}
        </Button>
        <Input ref={inputRef} id={id} type="file" className="hidden" onChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}
