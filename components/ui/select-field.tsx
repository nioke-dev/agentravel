import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface Option { value: string; label: string; }
interface SelectFieldProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
  disabled?: boolean; // Add disabled prop
  placeholder?: string; // Add placeholder prop for better UX
}

export function SelectField({ 
  label, 
  value, 
  options, 
  onChange, 
  disabled = false, // Default to false
  placeholder 
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={`w-full text-gray-600 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
          <SelectValue placeholder={placeholder} />
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
