"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Eye, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Question {
  id: string
  title: string
  description: string
  tags: string[]
  author: {
    username: string
    avatar?: string
    reputation?: number
  }
  createdAt: Date
  answerCount: number
  voteCount: number
  viewCount?: number
  isHot?: boolean
  hasAcceptedAnswer?: boolean
}

interface ModernQuestionCardProps {
  question: Question
}

export function ModernQuestionCard({ question }: ModernQuestionCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <Card className="question-card group relative overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm hover:from-background/90 hover:to-background/60">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute inset-[1px] bg-background rounded-xl"></div>

      <CardContent className="relative p-6 space-y-4">
        {/* Header with badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {question.isHot && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 animate-pulse">
                <TrendingUp className="w-3 h-3 mr-1" />
                Hot
              </Badge>
            )}
            {question.hasAcceptedAnswer && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <Award className="w-3 h-3 mr-1" />
                Solved
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{question.viewCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Question title */}
        <Link href={`/questions/${question.id}`} className="block group/title">
          <h3 className="text-xl font-bold leading-tight group-hover/title:text-primary transition-colors duration-300 line-clamp-2">
            {question.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">{question.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="tag-bounce hover:bg-primary/20 hover:text-primary transition-all duration-200 cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          {/* Author info */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={question.author.avatar || "/placeholder.svg"} alt={question.author.username} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-sm font-semibold">
                {question.author.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{question.author.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(question.createdAt, { addSuffix: true })}
              </p>
            </div>
            {question.author.reputation && (
              <Badge variant="outline" className="text-xs">
                {question.author.reputation} rep
              </Badge>
            )}
          </div>

          {/* Interaction buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-all duration-300 ${isLiked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"}`}
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-semibold">{question.voteCount + (isLiked ? 1 : 0)}</span>
            </Button>

            <Button variant="ghost" size="sm" className="hover:text-blue-500 transition-colors duration-300">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="font-semibold">{question.answerCount}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
