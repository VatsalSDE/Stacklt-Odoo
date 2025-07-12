"use client"

import { useState } from "react"
import { ModernHeader } from "@/components/modern-header"
import { HeroSection } from "@/components/hero-section"
import { ModernQuestionCard } from "@/components/modern-question-card"
import { ModernFilters } from "@/components/modern-filters"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles, Plus } from "lucide-react"
import { AskQuestionDialog } from "@/components/ask-question-dialog"
import { useAuth } from "@/contexts/auth-context"

// Enhanced mock data
const mockQuestions = [
  {
    id: "1",
    title: "How to implement real-time collaboration in React with WebSockets?",
    description:
      "I'm building a collaborative code editor similar to VS Code Live Share. I need to sync cursor positions, text changes, and user presence across multiple clients. What's the best architecture for handling conflicts and ensuring data consistency?",
    tags: ["react", "websockets", "real-time", "collaboration"],
    author: {
      username: "CodeMaster",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 2847,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    answerCount: 8,
    voteCount: 24,
    viewCount: 156,
    isHot: true,
    hasAcceptedAnswer: true,
  },
  {
    id: "2",
    title: "Advanced TypeScript: Generic constraints with conditional types",
    description:
      "I'm trying to create a utility type that extracts specific properties from an object based on their value types. The constraint should work with nested objects and arrays. Here's what I've tried so far...",
    tags: ["typescript", "generics", "advanced", "utility-types"],
    author: {
      username: "TypeScriptNinja",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 5432,
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    answerCount: 12,
    voteCount: 45,
    viewCount: 289,
    isHot: true,
    hasAcceptedAnswer: false,
  },
  {
    id: "3",
    title: "Optimizing Next.js app performance: Bundle splitting strategies",
    description:
      "My Next.js application bundle size has grown to 2MB+ and initial load times are suffering. I've tried dynamic imports but still seeing issues. What are the best practices for code splitting in large applications?",
    tags: ["nextjs", "performance", "optimization", "bundle-splitting"],
    author: {
      username: "PerformanceGuru",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 3156,
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    answerCount: 6,
    voteCount: 18,
    viewCount: 94,
    isHot: false,
    hasAcceptedAnswer: true,
  },
  {
    id: "4",
    title: "Database design for multi-tenant SaaS application",
    description:
      "I'm architecting a SaaS platform that needs to support thousands of tenants. Should I use separate databases, schemas, or row-level security? What are the trade-offs in terms of performance, security, and maintenance?",
    tags: ["database", "saas", "multi-tenant", "architecture"],
    author: {
      username: "ArchitectPro",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 4721,
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    answerCount: 15,
    voteCount: 67,
    viewCount: 423,
    isHot: true,
    hasAcceptedAnswer: false,
  },
  {
    id: "5",
    title: "Implementing OAuth 2.0 with PKCE in React Native",
    description:
      "I need to implement secure authentication in my React Native app using OAuth 2.0 with PKCE flow. The app needs to work with multiple providers (Google, Apple, GitHub). What's the recommended approach?",
    tags: ["react-native", "oauth", "authentication", "security"],
    author: {
      username: "MobileDev",
      avatar: "/placeholder.svg?height=40&width=40",
      reputation: 1892,
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    answerCount: 4,
    voteCount: 12,
    viewCount: 78,
    isHot: false,
    hasAcceptedAnswer: false,
  },
]

export default function HomePage() {
  const [questions, setQuestions] = useState(mockQuestions)
  const [activeFilter, setActiveFilter] = useState("hot")
  const [currentPage, setCurrentPage] = useState(1)
  const questionsPerPage = 5
  const [showAskDialog, setShowAskDialog] = useState(false)
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("") // New state for search query

  const totalPages = Math.ceil(questions.length / questionsPerPage)
  const startIndex = (currentPage - 1) * questionsPerPage
  const endIndex = startIndex + questionsPerPage

  // Filter questions based on search query and active filter
  const filteredAndSortedQuestions = [...mockQuestions]
    .filter((question) => {
      const lowerCaseQuery = searchQuery.toLowerCase()
      // Filter by title or if any tag includes the query
      return (
        question.title.toLowerCase().includes(lowerCaseQuery) ||
        question.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
      )
    })
    .sort((a, b) => {
      switch (activeFilter) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime()
        case "hot":
          return b.voteCount + b.answerCount * 2 - (a.voteCount + a.answerCount * 2)
        case "unanswered":
          return a.answerCount - b.answerCount
        case "votes":
          return b.voteCount - a.voteCount
        default:
          return 0
      }
    })

  const currentQuestions = filteredAndSortedQuestions.slice(startIndex, endIndex)

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
    // The filtering and sorting logic is now directly in filteredAndSortedQuestions
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page on new search
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <ModernHeader onSearch={handleSearch} /> {/* Pass handleSearch to ModernHeader */}
      {/* Hero Section */}
      <HeroSection />
      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Ask Question Button and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <Button
              onClick={() => setShowAskDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-lift group"
              // Removed disabled={!user} for testing purposes
            >
              <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Ask New Question
            </Button>
            <ModernFilters
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              questionCount={filteredAndSortedQuestions.length} // Use filtered count
            />
          </div>

          {/* Questions Grid */}
          <div className="mt-12 space-y-6">
            {currentQuestions.length === 0 ? (
              <div className="text-center text-muted-foreground text-lg py-10">
                No questions found matching your criteria.
              </div>
            ) : (
              currentQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ModernQuestionCard question={question} />
                </div>
              ))
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-16">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-hover-lift"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="lg"
                    onClick={() => setCurrentPage(page)}
                    className={`
                      btn-hover-lift min-w-[3rem]
                      ${currentPage === page ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : ""}
                    `}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-hover-lift"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}

       
         
          <AskQuestionDialog open={showAskDialog} onOpenChange={setShowAskDialog} />
        </div>
      </main>
    </div>
  )
}
