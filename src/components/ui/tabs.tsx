import * as React from "react"
import { cn } from "../../utils/cn"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children, className }) => {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  value?: string
  onValueChange?: (value: string) => void
}

export const TabsList: React.FC<TabsListProps> = ({ children, className, value, onValueChange }) => {
  return (
    <div className={cn("inline-flex items-center rounded-lg bg-slate-900/60 p-1 border border-white/5", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const typedChild = child as React.ReactElement<any>;
          return React.cloneElement(typedChild, { 
            active: typedChild.props.value === value,
            onClick: () => onValueChange && onValueChange(typedChild.props.value)
          })
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  active?: boolean
  onClick?: () => void
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, className, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 cursor-pointer",
        active 
          ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md"
          : "text-slate-400 hover:text-slate-200",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
  activeValue?: string
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className, activeValue }) => {
  if (value !== activeValue) return null

  return (
    <div className={cn("w-full transition-all duration-300 animate-fade-in", className)}>
      {children}
    </div>
  )
}
