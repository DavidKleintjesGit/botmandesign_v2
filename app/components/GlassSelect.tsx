"use client";

import { useEffect, useId, useRef, useState } from "react";

export type GlassSelectOption = {
  value: string;
  label: string;
};

type GlassSelectProps = {
  id?: string;
  label: string;
  value: string;
  placeholder?: string;
  options: GlassSelectOption[];
  required?: boolean;
  onChange: (value: string) => void;
};

const INPUT_FIELD_CLASS =
  "flex w-full items-center justify-between border bg-transparent px-4 py-3 text-left text-sm outline-none transition-colors duration-300";

const INPUT_FIELD_STYLE = {
  borderColor: "rgba(182, 163, 144, 0.45)",
  fontFamily: "var(--font-montserrat)",
};

const DROPDOWN_GLASS_STYLE = {
  backgroundColor: "rgba(255, 255, 255, 0.015)",
  border: "0.5px solid rgba(238, 227, 211, 0.08)",
  boxShadow: `
    inset 0 1px 1px rgba(255, 255, 255, 0.05),
    inset 0 -1px 1px rgba(0, 0, 0, 0.02),
    0 4px 20px rgba(0, 0, 0, 0.06)
  `,
};

export default function GlassSelect({
  id,
  label,
  value,
  placeholder = "Select an option",
  options,
  required = false,
  onChange,
}: GlassSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={selectId}
        className="mb-2 block text-xs uppercase tracking-[0.12em]"
        style={{
          fontFamily: "var(--font-montserrat)",
          color: "var(--color-almond)",
        }}
      >
        {label}
      </label>

      <button
        id={selectId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={INPUT_FIELD_CLASS}
        style={{
          ...INPUT_FIELD_STYLE,
          color: selectedOption ? "var(--color-champagne)" : "var(--color-almond)",
          borderColor: isOpen ? "var(--color-champagne)" : INPUT_FIELD_STYLE.borderColor,
        }}
      >
        <span className="truncate pr-3">
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {required && (
        <input
          tabIndex={-1}
          aria-hidden
          required
          value={value}
          onChange={() => undefined}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      )}

      <div
        role="listbox"
        aria-labelledby={selectId}
        className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-[1rem] backdrop-blur-[48px] backdrop-saturate-150 transition-all duration-300 ease-out ${
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        style={DROPDOWN_GLASS_STYLE}
      >
        <ul className="py-1">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm transition-colors duration-200 hover:bg-[rgba(238,227,211,0.05)]"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    color: isSelected ? "var(--color-champagne)" : "var(--color-almond)",
                  }}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
