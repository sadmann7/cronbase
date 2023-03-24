import { Switch } from "@headlessui/react";
import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type SwitchButtonProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues, any>;
  name: Path<TFieldValues>;
  defaultChecked?: boolean;
  label: string;
  description?: string;
  srText?: string;
};

const ToggleInput = <TFieldValues extends FieldValues>({
  control,
  name,
  defaultChecked = false,
  label,
  description,
  srText = "Toggle",
}: SwitchButtonProps<TFieldValues>) => {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <Controller
      control={control}
      name={name}
      // defaultValue={defaultChecked as TFieldValues[typeof name]}
      render={({ field: { onChange } }) => (
        <Switch.Group>
          <div className="flex items-center justify-between gap-5">
            {description ? (
              <div className="grid gap-1">
                <Switch.Label className="text-sm font-medium text-gray-300 sm:text-base">
                  {label}
                </Switch.Label>
                <Switch.Description className="text-sm text-gray-400">
                  {description}
                </Switch.Description>
              </div>
            ) : (
              <Switch.Label className="text-sm font-medium text-gray-300 sm:text-base">
                {label}
              </Switch.Label>
            )}
            <Switch
              checked={enabled}
              onChange={(val) => {
                onChange(val);
                setEnabled(val);
              }}
              className={twMerge(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2  focus:ring-offset-gray-900",
                enabled ? "bg-violet-700" : "bg-violet-500"
              )}
            >
              <span className="sr-only">{srText}</span>
              <span
                aria-hidden="true"
                className={twMerge(
                  "inline-block h-5 w-5 rounded-full bg-gray-50 shadow ring-0 transition duration-200 ease-in-out",
                  enabled ? "translate-x-5" : "translate-x-0"
                )}
              />
            </Switch>
          </div>
        </Switch.Group>
      )}
    />
  );
};

export default ToggleInput;
