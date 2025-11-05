import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select"

type SelectOption = string | { value: string; label: string }

interface ConfigSelectProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly SelectOption[]
  placeholder?: string
  className?: string
  labelClassName?: string
  triggerClassName?: string
  valueClassName?: string
  contentClassName?: string
}

export default function ConfigSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  labelClassName,
  triggerClassName,
  valueClassName,
  contentClassName
}: ConfigSelectProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={cn("text-sm font-medium text-muted-foreground", labelClassName)}>
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className={triggerClassName}>
          <SelectValue placeholder={placeholder} className={valueClassName} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {options.map((option) => {
            const optionValue = typeof option === "string" ? option : option.value
            const optionLabel = typeof option === "string" ? option : option.label

            return (
              <SelectItem key={optionValue} value={optionValue}>
                {optionLabel}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
