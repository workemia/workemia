"use client"

import * as React from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  variant?: "button" | "menu-item" | "dropdown"
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ 
  variant = "button", 
  className,
  showLabel = false 
}: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn("w-9 h-9", className)}
        disabled
      >
        <Palette className="h-4 w-4" />
        <span className="sr-only">Loading theme...</span>
      </Button>
    )
  }

  const currentTheme = resolvedTheme || theme

  if (variant === "menu-item") {
    return (
      <DropdownMenuItem 
        onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")} 
        className={cn("cursor-pointer", className)}
      >
        {currentTheme === "dark" ? (
          <>
            <Sun className="mr-3 h-4 w-4" />
            <span>Modo Claro</span>
          </>
        ) : (
          <>
            <Moon className="mr-3 h-4 w-4" />
            <span>Modo Escuro</span>
          </>
        )}
      </DropdownMenuItem>
    )
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "relative transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
              showLabel ? "px-3 gap-2" : "w-9 h-9",
              className
            )}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            {showLabel && (
              <span className="hidden sm:inline text-sm">
                {currentTheme === "dark" ? "Escuro" : "Claro"}
              </span>
            )}
            <span className="sr-only">Alterar tema</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
            <Sun className="mr-3 h-4 w-4" />
            <span>Claro</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
            <Moon className="mr-3 h-4 w-4" />
            <span>Escuro</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
            <Palette className="mr-3 h-4 w-4" />
            <span>Sistema</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
        showLabel ? "px-3 gap-2" : "w-9 h-9",
        className
      )}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
      {showLabel && (
        <span className="hidden sm:inline text-sm font-medium">
          {currentTheme === "dark" ? "Escuro" : "Claro"}
        </span>
      )}
      <span className="sr-only">
        Alterar para {currentTheme === "dark" ? "modo claro" : "modo escuro"}
      </span>
    </Button>
  )
}