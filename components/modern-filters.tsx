"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Flame, Clock, MessageSquare, TrendingUp, Filter } from "lucide-react"

interface ModernFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  questionCount: number
}

export function ModernFilters({ activeFilter, onFilterChange, questionCount }: ModernFiltersProps) {
  const filters = [
    {
      value: "newest",
      label: "Latest",
      icon: Clock,
      description: "Recently asked questions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "hot",
      label: "Hot",
      icon: Flame,
      description: "Trending discussions",
      color: "from-orange-500 to-red-500",
    },
    {
      value: "unanswered",
      label: "Unanswered",
      icon: MessageSquare,
      description: "Questions needing help",
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "votes",
      label: "Top Voted",
      icon: TrendingUp,
      description: "Most popular questions",
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Discover Questions
          </h2>
          <p className="text-muted-foreground mt-1">
            <Badge variant="secondary" className="mr-2">
              {questionCount.toLocaleString()}
            </Badge>
            questions waiting for your expertise
          </p>
        </div>

        <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const Icon = filter.icon
          const isActive = activeFilter === filter.value

          return (
            <Button
              key={filter.value}
              variant={isActive ? "default" : "outline"}
              onClick={() => onFilterChange(filter.value)}
              className={`
                relative overflow-hidden transition-all duration-300 btn-hover-lift group
                ${
                  isActive
                    ? `bg-gradient-to-r ${filter.color} text-white shadow-lg hover:shadow-xl`
                    : "hover:border-primary/50 hover:bg-primary/5"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 mr-2 ${isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform duration-300"}`}
              />
              <span className="font-medium">{filter.label}</span>

              {/* Hover tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                {filter.description}
              </div>
            </Button>
          )
        })}
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <Select value={activeFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full h-12 rounded-xl bg-background/50 backdrop-blur-sm border-2 border-transparent focus:border-primary/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-effect">
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <SelectItem key={filter.value} value={filter.value} className="hover:bg-primary/10">
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {filter.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
