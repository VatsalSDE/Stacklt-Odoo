"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bold, Italic, Strikethrough, List, ListOrdered, Link, ImageIcon, Smile } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const insertText = useCallback(
    (before: string, after = "") => {
      const textarea = document.querySelector("textarea") as HTMLTextAreaElement
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)

      const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
      onChange(newText)

      // Reset cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
      }, 0)
    },
    [value, onChange],
  )

  const formatButtons = [
    { icon: Bold, action: () => insertText("**", "**"), tooltip: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), tooltip: "Italic" },
    { icon: Strikethrough, action: () => insertText("~~", "~~"), tooltip: "Strikethrough" },
    { icon: List, action: () => insertText("\n- "), tooltip: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("\n1. "), tooltip: "Numbered List" },
    { icon: Link, action: () => insertText("[", "](url)"), tooltip: "Link" },
    { icon: ImageIcon, action: () => insertText("![alt](", ")"), tooltip: "Image" },
    { icon: Smile, action: () => insertText("😊"), tooltip: "Emoji" },
  ]

  return (
    <div
      className={`border rounded-xl bg-background/50 backdrop-blur-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 ${className}`}
    >
      <div className="flex flex-wrap gap-1 p-3 border-b bg-muted/30 rounded-t-xl">
        <TooltipProvider>
          {formatButtons.map((button, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  className="h-8 w-8 p-0 hover:bg-primary/10 transition-colors duration-200"
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{button.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] border-0 resize-none focus-visible:ring-0 rounded-t-none rounded-b-xl bg-transparent p-4"
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement
          // This part is for internal state if needed, not directly affecting the input value
        }}
      />
    </div>
  )
}
