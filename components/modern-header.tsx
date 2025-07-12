"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Menu, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthDialog } from "@/components/auth-dialog"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface ModernHeaderProps {
  onSearch: (query: string) => void // Add onSearch prop
}

export function ModernHeader({ onSearch }: ModernHeaderProps) {
  const { user, logout } = useAuth()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query) // Pass search query up to parent
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-effect shadow-lg border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between px-6">
        {/* Logo with glow effect */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-pulse-glow">
              StackIt
            </h1>
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-float" />
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search the universe of knowledge by title or tags..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 h-12 rounded-full border-2 border-transparent bg-background/50 backdrop-blur-sm transition-all duration-300 focus:border-primary/50 focus:bg-background/80 focus:shadow-lg focus:shadow-primary/20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side with enhanced buttons */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Ask Question Button */}
          {/* Ask Question button moved to main content */}

          {/* Notifications */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-12 w-12 rounded-full hover:bg-primary/10 transition-all duration-300 btn-hover-lift"
            >
              <Bell className="h-6 w-6" />
              <Badge className="absolute -top-1 -right-1 h-6 w-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-pink-500 animate-pulse">
                3
              </Badge>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75"></div>
            </Button>
          )}

          {/* User Menu or Login */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-12 w-12 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300"
                >
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 glass-effect" align="end" forceMount>
                <div className="flex flex-col space-y-2 p-4">
                  <p className="text-sm font-semibold leading-none bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      Pro Member
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      1.2k Rep
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-primary/10">
                  <span>Profile & Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10">
                  <span>Your Questions</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10">
                  <span>Bookmarks</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="hover:bg-red-500/10 text-red-500">
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => setShowAuthDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-lift"
            >
              Join StackIt
            </Button>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden h-12 w-12 rounded-full hover:bg-primary/10">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-12 h-12 rounded-full bg-background/50 backdrop-blur-sm border-2 border-transparent focus:border-primary/50"
          />
        </div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </header>
  )
}
