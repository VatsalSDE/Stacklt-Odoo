"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowUp, 
  ArrowDown, 
  CheckCircle, 
  MessageSquare, 
  Eye, 
  Calendar,
  User,
  ThumbsUp
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Answer {
  id: string
  content: string
  author: {
    _id: string
    username: string
    avatar: string
    reputation: number
  }
  createdAt: string
  isAccepted: boolean
  voteCount: number
}

interface Question {
  id: string
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
  updatedAt: string
  viewCount: number
  answerCount: number
  voteCount: number
  hasAcceptedAnswer: boolean
  isHot: boolean
  answers: Answer[]
}

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const { toast } = useToast()
  
  const [question, setQuestion] = useState<Question | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answerContent, setAnswerContent] = useState("")
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [userVotes, setUserVotes] = useState<{ [key: string]: 'upvote' | 'downvote' }>({})

  const questionId = params.id as string

  const fetchQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/questions/${questionId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch question')
      }
      const data = await response.json()
      setQuestion(data.question)
    } catch (error) {
      console.error('Error fetching question:', error)
      toast({
        title: "Error",
        description: "Failed to load question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (questionId) {
      fetchQuestion()
    }
  }, [questionId])

  const handleVote = async (itemId: string, itemType: 'question' | 'answer', voteType: 'upvote' | 'downvote') => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote.",
        variant: "destructive",
      })
      return
    }

    try {
      const endpoint = itemType === 'question' 
        ? `/api/questions/${itemId}/vote`
        : `/api/answers/${itemId}/vote`

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ voteType })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to vote')
      }

      const data = await response.json()
      
      // Update the vote count
      if (itemType === 'question' && question) {
        setQuestion(prev => prev ? { ...prev, voteCount: data.voteCount } : null)
      } else if (itemType === 'answer' && question) {
        setQuestion(prev => prev ? {
          ...prev,
          answers: prev.answers.map(answer => 
            answer.id === itemId 
              ? { ...answer, voteCount: data.voteCount }
              : answer
          )
        } : null)
      }

      // Update user vote state
      setUserVotes(prev => ({
        ...prev,
        [itemId]: data.userVote
      }))

    } catch (error) {
      console.error('Error voting:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAcceptAnswer = async (answerId: string) => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to accept answers.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/answers/${answerId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to accept answer')
      }

      // Update the question state
      setQuestion(prev => prev ? {
        ...prev,
        hasAcceptedAnswer: true,
        answers: prev.answers.map(answer => ({
          ...answer,
          isAccepted: answer.id === answerId
        }))
      } : null)

      toast({
        title: "Success",
        description: "Answer accepted successfully!",
      })

    } catch (error) {
      console.error('Error accepting answer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to accept answer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!answerContent.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide an answer.",
        variant: "destructive",
      })
      return
    }

    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to post an answer.",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingAnswer(true)

    try {
      const response = await fetch(`/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: answerContent.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to post answer')
      }

      const data = await response.json()
      
      // Add the new answer to the question
      setQuestion(prev => prev ? {
        ...prev,
        answers: [...prev.answers, data.answer],
        answerCount: prev.answerCount + 1
      } : null)

      setAnswerContent("")
      
      toast({
        title: "Success",
        description: "Your answer has been posted successfully!",
      })

    } catch (error) {
      console.error('Error posting answer:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to post answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading question...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-10">
            <p className="text-muted-foreground text-lg">Question not found.</p>
            <Button onClick={() => router.push('/')} className="mt-4">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {question.viewCount} views
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {question.answerCount} answers
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {question.isHot && (
                  <Badge variant="destructive">Hot</Badge>
                )}
                {question.hasAcceptedAnswer && (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Solved
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {/* Voting */}
              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(question.id, 'question', 'upvote')}
                  className={`h-8 w-8 p-0 ${userVotes[question.id] === 'upvote' ? 'text-green-600' : ''}`}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{question.voteCount}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(question.id, 'question', 'downvote')}
                  className={`h-8 w-8 p-0 ${userVotes[question.id] === 'downvote' ? 'text-red-600' : ''}`}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="prose max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: question.description }} />
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Asked by
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={question.author.avatar} />
                    <AvatarFallback>{question.author.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{question.author.username}</span>
                  <span>({question.author.reputation} reputation)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {question.answerCount} Answer{question.answerCount !== 1 ? 's' : ''}
          </h2>
          
          {question.answers.map((answer) => (
            <Card key={answer.id} className={answer.isAccepted ? 'border-green-500 bg-green-50/50' : ''}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, 'answer', 'upvote')}
                      className={`h-8 w-8 p-0 ${userVotes[answer.id] === 'upvote' ? 'text-green-600' : ''}`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">{answer.voteCount}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(answer.id, 'answer', 'downvote')}
                      className={`h-8 w-8 p-0 ${userVotes[answer.id] === 'downvote' ? 'text-red-600' : ''}`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="prose max-w-none mb-4">
                      <div dangerouslySetInnerHTML={{ __html: answer.content }} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        Answered by
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={answer.author.avatar} />
                          <AvatarFallback>{answer.author.username[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{answer.author.username}</span>
                        <span>({answer.author.reputation} reputation)</span>
                        <span>• {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {answer.isAccepted && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Accepted
                          </Badge>
                        )}
                        {user && question.author._id === user.id && !answer.isAccepted && !question.hasAcceptedAnswer && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptAnswer(answer.id)}
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Post Answer */}
        {user && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Your Answer</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here..."
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingAnswer}
                  >
                    {isSubmittingAnswer ? "Posting..." : "Post Answer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Please log in to post an answer.
                </p>
                <Button onClick={() => router.push('/')}>
                  Log In
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
