"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Palette, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
  disabled?: boolean;
}

const presetColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#F1948A",
  "#85C1E9",
  "#D7BDE2",
];

export default function ColorPicker({ value = "#3B82F6", onChange, className, disabled = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const [hexInput, setHexInput] = useState(value);
  const [copied, setCopied] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromHSL = useRef(false);
  const isUpdatingFromHex = useRef(false);

  const { t } = useTranslation();

  // Convert hex to HSL
  const hexToHsl = useCallback((hex: string) => {
    const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
    const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
    const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }, []);

  // Convert HSL to hex
  const hslToHex = useCallback((h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  // Initialize HSL values from the initial value prop
  useEffect(() => {
    if (value && value.match(/^#[0-9A-F]{6}$/i)) {
      const [h, s, l] = hexToHsl(value);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setCurrentColor(value);
      setHexInput(value);
    }
  }, [value, hexToHsl]);

  // Handle HSL slider changes
  const handleHueChange = (newHue: number) => {
    isUpdatingFromHSL.current = true;
    setHue(newHue);
    const newColor = hslToHex(newHue, saturation, lightness);
    setCurrentColor(newColor);
    setHexInput(newColor);
    onChange?.(newColor);
    isUpdatingFromHSL.current = false;
  };

  const handleSaturationChange = (newSaturation: number) => {
    isUpdatingFromHSL.current = true;
    setSaturation(newSaturation);
    const newColor = hslToHex(hue, newSaturation, lightness);
    setCurrentColor(newColor);
    setHexInput(newColor);
    onChange?.(newColor);
    isUpdatingFromHSL.current = false;
  };

  const handleLightnessChange = (newLightness: number) => {
    isUpdatingFromHSL.current = true;
    setLightness(newLightness);
    const newColor = hslToHex(hue, saturation, newLightness);
    setCurrentColor(newColor);
    setHexInput(newColor);
    onChange?.(newColor);
    isUpdatingFromHSL.current = false;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setHexInput(inputValue);

    if (inputValue.match(/^#[0-9A-F]{6}$/i)) {
      isUpdatingFromHex.current = true;
      setCurrentColor(inputValue);
      const [h, s, l] = hexToHsl(inputValue);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      onChange?.(inputValue);
      isUpdatingFromHex.current = false;
    }
  };

  const handlePresetClick = (color: string) => {
    isUpdatingFromHex.current = true;
    setCurrentColor(color);
    setHexInput(color);
    const [h, s, l] = hexToHsl(color);
    setHue(h);
    setSaturation(s);
    setLightness(l);
    onChange?.(color);
    isUpdatingFromHex.current = false;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      console.error("Failed to copy color:", err);
    }
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm transition-all duration-200",
          "hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "border-blue-500 shadow-md",
        )}
      >
        <div
          className="w-6 h-6 rounded-md border-2 border-gray-300 dark:border-gray-600 shadow-sm"
          style={{ backgroundColor: currentColor }}
        />
        <span className="flex-1 text-left font-mono text-sm text-black dark:text-white">{currentColor.toUpperCase()}</span>
        <ChevronDown className={cn("w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-xl shadow-xl z-50 p-6">
          {/* Color Preview and Hex Input */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-black dark:text-white mb-2">{t("components.colorPicker.hex_color")}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  className="flex-1 pl-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#000000"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                </button>
              </div>
            </div>
          </div>

          {/* HSL Sliders */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                {t("components.colorPicker.hue")}: {Math.round(hue)}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => handleHueChange(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                {t("components.colorPicker.saturation")}: {Math.round(saturation)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => handleSaturationChange(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, 0%, ${lightness}%), 
                    hsl(${hue}, 100%, ${lightness}%))`,
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                {t("components.colorPicker.lightness")}: {Math.round(lightness)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => handleLightnessChange(Number(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, ${saturation}%, 0%), 
                    hsl(${hue}, ${saturation}%, 50%), 
                    hsl(${hue}, ${saturation}%, 100%))`,
                }}
              />
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-3">
              <Palette className="w-4 h-4 inline mr-2" />
              {t("components.colorPicker.preset_colors")}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((color) => (
                <button
                  key={color + Math.random()}
                  type="button"
                  onClick={() => handlePresetClick(color)}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110",
                    currentColor.toLowerCase() === color.toLowerCase()
                      ? "border-black dark:border-white shadow-lg"
                      : "border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md",
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
