import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
          // Variants
          variant === "default" && "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-900/20 hover:brightness-110 hover:shadow-cyan-500/10",
          variant === "destructive" && "bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30",
          variant === "outline" && "border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-200",
          variant === "secondary" && "bg-cyan-500 text-slate-900 shadow hover:bg-cyan-400",
          variant === "ghost" && "hover:bg-white/5 text-slate-300 hover:text-white",
          variant === "link" && "text-violet-400 underline-offset-4 hover:underline",
          variant === "glow" && "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.8)]",
          // Sizes
          size === "default" && "h-10 px-4 py-2",
          size === "sm" && "h-9 px-3 text-xs",
          size === "lg" && "h-11 px-8 text-base",
          size === "icon" && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
