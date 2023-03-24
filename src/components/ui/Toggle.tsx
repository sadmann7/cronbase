import type { SetState } from "@/types/globals";
import { Switch } from "@headlessui/react";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type ToggleProps = {
  enabled: boolean;
  setEnabled: SetState<boolean>;
  disabled?: boolean;
  enabledLabel?: string;
  disabledLabel?: string;
  srText?: string;
} & React.ComponentPropsWithoutRef<typeof Switch.Group>;

const Toggle = forwardRef<React.ElementRef<typeof Switch.Group>, ToggleProps>(
  (
    {
      className = "",
      enabled,
      setEnabled,
      disabled = false,
      enabledLabel = "",
      disabledLabel = "",
      srText = "Toggle",
      ...props
    },
    ref
  ) => {
    return (
      <Switch.Group as="div" ref={ref} className={className} {...props}>
        <div className="flex items-center">
          {disabledLabel ? (
            <Switch.Label as="span" className="mr-3 cursor-default">
              <span
                className={`text-sm font-medium ${
                  !enabled ? "text-white" : "text-gray-500"
                } `}
              >
                {disabledLabel}
              </span>
            </Switch.Label>
          ) : null}
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={twMerge(
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
              enabled ? "bg-violet-700" : "bg-violet-500",
              disabled && "pointer-events-none opacity-50"
            )}
            disabled={disabled}
          >
            <span className="sr-only">{srText}</span>
            <span
              aria-hidden="true"
              className={twMerge(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                enabled ? "translate-x-5" : "translate-x-0"
              )}
            />
          </Switch>
          {enabledLabel ? (
            <Switch.Label as="span" className="ml-3 cursor-default">
              <span
                className={`text-sm font-medium ${
                  enabled ? "text-white" : "text-gray-500"
                } `}
              >
                {enabledLabel}
              </span>
            </Switch.Label>
          ) : null}
        </div>
      </Switch.Group>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
