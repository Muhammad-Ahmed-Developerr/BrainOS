import * as React from "react"
import { cn } from "../../utils/cn"

export interface SliderProps {
  min: number
  max: number
  step?: number
  value: number
  onValueChange: (value: number) => void
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(Number(e.target.value))
  }

  // Calculate percentage for background gradient fill
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("relative flex w-full items-center select-none touch-none", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        style={{
          background: `linear-gradient(to right, #7C3AED 0%, #06B6D4 ${percentage}%, #1E293B ${percentage}%, #1E293B 100%)`
        }}
      />
    </div>
  )
}
export default Slider;
