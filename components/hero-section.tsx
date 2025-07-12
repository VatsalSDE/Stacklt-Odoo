"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Users, Lightbulb, Rocket } from "lucide-react"
import { useState } from "react"
import { AskQuestionDialog } from "@/components/ask-question-dialog"
import { useAuth } from "@/contexts/auth-context"

export function HeroSection() {
  const [showAskDialog, setShowAskDialog] = useState(false)
  const { user } = useAuth()

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-bg opacity-10"></div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Code className="h-8 w-8 text-purple-400 opacity-60" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "2s" }}>
        <Lightbulb className="h-6 w-6 text-yellow-400 opacity-60" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: "4s" }}>
        <Users className="h-7 w-7 text-blue-400 opacity-60" />
      </div>

      <div className="container px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main heading with gradient */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Ask. Learn.
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Grow Together.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join the most vibrant community of developers, where every question sparks innovation and every answer
            builds the future.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-sm text-muted-foreground">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                25K+
              </div>
              <div className="text-sm text-muted-foreground">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                99%
              </div>
              <div className="text-sm text-muted-foreground">Problem Solved</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setShowAskDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 btn-hover-lift group text-lg"
              // Removed disabled={!user} for testing purposes
            >
              <Rocket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary/30 hover:border-primary/60 bg-background/50 backdrop-blur-sm px-8 py-4 rounded-full font-semibold transition-all duration-300 btn-hover-lift text-lg"
            >
              Explore Questions
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12">
            <p className="text-sm text-muted-foreground mb-6">Trusted by developers from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold">Google</div>
              <div className="text-2xl font-bold">Microsoft</div>
              <div className="text-2xl font-bold">Meta</div>
              <div className="text-2xl font-bold">Netflix</div>
              <div className="text-2xl font-bold">Spotify</div>
            </div>
          </div>
        </div>
      </div>

      <AskQuestionDialog open={showAskDialog} onOpenChange={setShowAskDialog} />
    </section>
  )
}
