import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface Option { value: string; label: string; }
interface SelectFieldProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full text-gray-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#E7E7E7] border-gray-400">
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
