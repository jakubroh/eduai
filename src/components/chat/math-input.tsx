"use client";

import { useEffect, useRef } from "react";
import { addStyles, EditableMathField } from "react-mathquill";

// Inicializace stylů MathQuill
if (typeof window !== "undefined") {
  addStyles();
}

interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onSubmit?: () => void;
}

export function MathInput({ value, onChange, disabled, onSubmit }: MathInputProps) {
  const mathFieldRef = useRef<any>(null);

  useEffect(() => {
    if (mathFieldRef.current) {
      mathFieldRef.current.latex(value);
    }
  }, [value]);

  return (
    <div className="border border-gray-300 rounded-lg p-3">
      <EditableMathField
        disabled={disabled}
        latex={value}
        onChange={(mathField) => {
          onChange(mathField.latex());
        }}
        mathquillDidMount={(mathField) => {
          mathFieldRef.current = mathField;
        }}
        config={{
          spaceBehavesLikeTab: true,
          leftRightIntoCmdGoes: "up",
          restrictMismatchedBrackets: true,
          sumStartsWithNEquals: true,
          supSubsRequireOperand: true,
          autoCommands: "pi theta sqrt sum prod alpha beta gamma",
          autoOperatorNames: "sin cos tan",
        }}
      />
      <div className="mt-2 text-sm text-gray-500">
        Tip: Použijte \ pro speciální symboly (např. \sqrt, \frac)
      </div>
    </div>
  );
} 