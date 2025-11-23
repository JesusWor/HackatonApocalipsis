import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "./utils";

function Slider({
  className,
  defaultValue = [1],
  value,
  min = -1000,
  max = 1000,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
    ? defaultValue
    : [1];

  const current = _values[0];
  const prevValueRef = React.useRef(current);
  const [movingLeft, setMovingLeft] = React.useState(false);

  React.useEffect(() => {
    if (current < prevValueRef.current) {
      setMovingLeft(true);
    } else if (current > prevValueRef.current) {
      setMovingLeft(false);
    }
    prevValueRef.current = current;
  }, [current]);

  const percent = ((current - min) / (max - min)) * 100;

  const rangeStyle = movingLeft
    ? { right: 0, width: `${100 - percent}%` }
    : { left: 0, width: `${percent}%` };

  // Fecha y hora estilo NASA
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="space-y-2 font-mono text-xs text-cyan-300">
      {/* Encabezado estilo NASA */}
      <div className="flex justify-between items-center px-1">
        <span className="uppercase tracking-widest text-cyan-400">LIVE</span>
        <span>{dateStr}</span>
        <span>{timeStr}</span>
      </div>

      {/* Slider con diseño anterior */}
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center select-none",
          "data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-muted relative grow overflow-hidden rounded-full",
            "data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full",
            "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
          )}
        >
          {/* Barra azul dinámica */}
          <div
            style={rangeStyle}
          />
          <SliderPrimitive.Range className="hidden" />
        </SliderPrimitive.Track>

        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };
