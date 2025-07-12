"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Question {
  id: string
  title: string
  description: string
  tags: string[]
  author: {
    username: string
    avatar?: string
  }
  createdAt: Date
  answerCount: number
  voteCount: number
}

interface QuestionCardProps {
  question: Question
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <Link href={`/questions/${question.id}`} className="block group">
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{question.title}</h3>
            </Link>

            <p className="text-muted-foreground line-clamp-2">{question.description}</p>

            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.author.avatar || "/placeholder.svg"} alt={question.author.username} />
                  <AvatarFallback className="text-xs">
                    {question.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{question.author.username}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="font-semibold">{question.answerCount}</div>
              <div>answers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">{question.voteCount}</div>
              <div>votes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
