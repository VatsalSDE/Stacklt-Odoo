"use client"

import type React from "react"

import { useState } from "react"
import { ModernHeader } from "@/components/modern-header" // Changed to ModernHeader
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ChevronUp, ChevronDown, Check, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Mock data for the question
const mockQuestion = {
  id: "1",
  title: "How to join 2 columns in a data set to make a separate column in SQL",
  description: `I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name and column 2 consists of last name I want a column to combine both first name and last name.

**What I've tried:**
- Looking at SQL documentation
- Searching online tutorials

**Expected result:**
A new column that combines first_name and last_name with a space in between.`,
  tags: ["sql", "database"],
  author: {
    username: "User Name",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  voteCount: 12,
  answers: [
    {
      id: "1",
      content: `You can use the **CONCAT** function or the **||** operator to combine columns in SQL.

Here are a few approaches:

**Method 1: Using CONCAT function**
\`\`\`sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM your_table;
\`\`\`

**Method 2: Using || operator**
\`\`\`sql
SELECT first_name || ' ' || last_name AS full_name
FROM your_table;
\`\`\`

**Method 3: Using + operator (SQL Server)**
\`\`\`sql
SELECT first_name + ' ' + last_name AS full_name
FROM your_table;
\`\`\``,
      author: {
        username: "SQLExpert",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      voteCount: 8,
      isAccepted: true,
    },
    {
      id: "2",
      content: `Another approach is to use the **CONCAT_WS** function which handles NULL values better:

\`\`\`sql
SELECT CONCAT_WS(' ', first_name, last_name) AS full_name
FROM your_table;
\`\`\`

This function will skip NULL values and won't add extra spaces.`,
      author: {
        username: "DatabaseGuru",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      voteCount: 5,
      isAccepted: false,
    },
  ],
}

export default function QuestionPage({ params }: { params: { id: string } }) {
  const [newAnswer, setNewAnswer] = useState("")
  const [questionVotes, setQuestionVotes] = useState(mockQuestion.voteCount)
  const [answerVotes, setAnswerVotes] = useState<Record<string, number>>({
    "1": mockQuestion.answers[0].voteCount,
    "2": mockQuestion.answers[1].voteCount,
  })
  const { user } = useAuth()
  const { toast } = useToast()

  const handleVote = (type: "question" | "answer", id?: string, direction: "up" | "down") => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to vote.",
        variant: "destructive",
      })
      return
    }

    if (type === "question") {
      setQuestionVotes((prev) => prev + (direction === "up" ? 1 : -1))
    } else if (id) {
      setAnswerVotes((prev) => ({
        ...prev,
        [id]: prev[id] + (direction === "up" ? 1 : -1),
      }))
    }
  }

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to post an answer.",
        variant: "destructive",
      })
      return
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Answer required",
        description: "Please write your answer before submitting.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Answer posted!",
      description: "Your answer has been submitted successfully.",
    })
    setNewAnswer("")
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader /> {/* Changed to ModernHeader */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">
              Questions
            </Link>
            <span>{">"}</span>
            <span className="text-foreground">How to join 2...</span>
          </nav>

          {/* Question */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Vote buttons */}
                <div className="flex flex-col items-center space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("question", undefined, "up")}
                    className="p-2"
                  >
                    <ChevronUp className="h-6 w-6" />
                  </Button>
                  <span className="text-lg font-semibold">{questionVotes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("question", undefined, "down")}
                    className="p-2"
                  >
                    <ChevronDown className="h-6 w-6" />
                  </Button>
                </div>

                {/* Question content */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-4">{mockQuestion.title}</h1>

                  <div className="prose prose-invert max-w-none mb-4">
                    <div className="whitespace-pre-wrap">{mockQuestion.description}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mockQuestion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={mockQuestion.author.avatar || "/placeholder.svg"}
                          alt={mockQuestion.author.username}
                        />
                        <AvatarFallback className="text-xs">
                          {mockQuestion.author.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{mockQuestion.author.username}</span>
                      <span className="text-sm text-muted-foreground">
                        asked {formatDistanceToNow(mockQuestion.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answers */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {mockQuestion.answers.length} Answer{mockQuestion.answers.length !== 1 ? "s" : ""}
            </h2>

            <div className="space-y-6">
              {mockQuestion.answers.map((answer) => (
                <Card key={answer.id} className={answer.isAccepted ? "border-green-500" : ""}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Vote buttons */}
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote("answer", answer.id, "up")}
                          className="p-2"
                        >
                          <ChevronUp className="h-6 w-6" />
                        </Button>
                        <span className="text-lg font-semibold">{answerVotes[answer.id]}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote("answer", answer.id, "down")}
                          className="p-2"
                        >
                          <ChevronDown className="h-6 w-6" />
                        </Button>
                        {answer.isAccepted && (
                          <div className="text-green-500">
                            <Check className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Answer content */}
                      <div className="flex-1">
                        <div className="prose prose-invert max-w-none mb-4">
                          <div className="whitespace-pre-wrap">{answer.content}</div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={answer.author.avatar || "/placeholder.svg"}
                                alt={answer.author.username}
                              />
                              <AvatarFallback className="text-xs">
                                {answer.author.username.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{answer.author.username}</span>
                            <span className="text-sm text-muted-foreground">
                              answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                            </span>
                          </div>

                          {answer.isAccepted && (
                            <Badge variant="default" className="bg-green-500">
                              Accepted Answer
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit Answer */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Submit Your Answer
              </h3>

              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  value={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your answer here. Be specific and provide examples if possible."
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={!user}>
                    {user ? "Submit Answer" : "Login to Answer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
