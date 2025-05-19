import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Core styles
          "flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-base",
          // File input overrides
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Placeholder and disabled
          "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          // Focus styles
          "focus:outline-none focus:border-gray-500 focus:ring-0",
          // Responsive text size
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
