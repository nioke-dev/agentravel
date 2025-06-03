import { Input } from "@/components/ui/input";
import React from "react";

interface FormFieldProps {
  label: string;
  type?: string;
  value: string | number;
  placeholder?: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export function FormField({ 
  label, 
  type = "text", 
  value, 
  placeholder, 
  onChange, 
  readOnly = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Input
        className="text-gray-600 border-b border-gray-300 font-normal"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
}
