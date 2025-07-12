"use client"

import { useState, useEffect } from "react"
import { ModernHeader } from "@/components/modern-header"
import { HeroSection } from "@/components/hero-section"
import { ModernQuestionCard } from "@/components/modern-question-card"
import { ModernFilters } from "@/components/modern-filters"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles, Plus } from "lucide-react"
import { AskQuestionDialog } from "@/components/ask-question-dialog"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

interface Question {
  _id: string
  title: string
  description: string
  tags: string[]
    author: {
    _id: string
    username: string
    avatar: string
    reputation: number
  }
  createdAt: string
  answerCount: number
  voteCount: number
  viewCount: number
  isHot: boolean
  hasAcceptedAnswer: boolean
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function HomePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeFilter, setActiveFilter] = useState("hot")
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [showAskDialog, setShowAskDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, token } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const fetchQuestions = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        filter: activeFilter,
        search: searchQuery,
        page: currentPage.toString(),
        limit: '5'
      })

      const response = await fetch(`/api/questions?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch questions')
      }

      const data = await response.json()
      setQuestions(data.questions)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [activeFilter, searchQuery, currentPage])

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleQuestionCreated = () => {
    setShowAskDialog(false)
    fetchQuestions() // Refresh the questions list
    toast({
      title: "Success",
      description: "Your question has been posted successfully!",
    })
  }

  const scrollToQuestions = () => {
    const questionsSection = document.getElementById('questions-section')
    if (questionsSection) {
      questionsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <ModernHeader onSearch={handleSearch} />
      {/* Hero Section */}
      <HeroSection onExploreQuestions={scrollToQuestions} />
      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Ask Question Button and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
            <Button
              onClick={() => setShowAskDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 btn-hover-lift group"
              disabled={!user}
            >
              <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              Ask New Question
            </Button>
            <ModernFilters
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              questionCount={pagination?.total || 0}
            />
          </div>

          {/* Questions Grid */}
          <div id="questions-section" className="mt-12 space-y-6">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center text-muted-foreground text-lg py-10">
                {searchQuery ? 'No questions found matching your search.' : 'No questions found.'}
              </div>
            ) : (
              questions.map((question, index) => (
                <div
                  key={question._id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ModernQuestionCard 
                    question={{
                      id: question._id,
                      title: question.title,
                      description: question.description,
                      tags: question.tags,
                      author: {
                        username: question.author.username,
                        avatar: question.author.avatar,
                        reputation: question.author.reputation,
                      },
                      createdAt: new Date(question.createdAt),
                      answerCount: question.answerCount,
                      voteCount: question.voteCount,
                      viewCount: question.viewCount,
                      isHot: question.isHot,
                      hasAcceptedAnswer: question.hasAcceptedAnswer,
                    }} 
                  />
                </div>
              ))
            )}
          </div>

          {/* Enhanced Pagination */}
          {pagination && pagination.pages > 1 && (
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
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
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
                onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                disabled={currentPage === pagination.pages}
                className="btn-hover-lift"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}

          <AskQuestionDialog 
            open={showAskDialog} 
            onOpenChange={setShowAskDialog}
            onQuestionCreated={handleQuestionCreated}
          />
        </div>
      </main>
    </div>
  )
}
