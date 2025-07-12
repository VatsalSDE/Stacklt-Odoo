"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function Filters({ activeFilter, onFilterChange }: FiltersProps) {
  const filters = [
    { value: "newest", label: "Newest" },
    { value: "unanswered", label: "Unanswered" },
    { value: "active", label: "Active" },
    { value: "votes", label: "Most Votes" },
  ]

  return (
    <div className="flex items-center space-x-2 mb-6">
      <div className="hidden sm:flex space-x-2">
        {filters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <Select value={activeFilter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" size="sm">
        More
      </Button>
    </div>
  )
}
