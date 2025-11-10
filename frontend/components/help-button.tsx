"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, ExternalLink, FileText, Scale, Brain, Clock } from "lucide-react"

export function HelpButton() {
  const [open, setOpen] = useState(false)

  const faqs = [
    {
      icon: Scale,
      question: "How does AI arbitration work?",
      answer: "Multiple AI models analyze your case evidence and reach consensus on a fair verdict with transparent reasoning."
    },
    {
      icon: FileText,
      question: "What evidence can I submit?",
      answer: "URLs to GitHub issues, chat logs, contracts, or any web-accessible documentation. Plus text evidence during gathering period."
    },
    {
      icon: Brain,
      question: "How is credibility scored?",
      answer: "AI evaluates evidence based on source reliability, relevance, consistency, and specificity (0-100 score)."
    },
    {
      icon: Clock,
      question: "What are the time limits?",
      answer: "Evidence gathering: ~7 days. Appeal window: ~3 days. Times can be adjusted by admin."
    }
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 mr-6 mb-2" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">Help & FAQs</h3>
            <p className="text-sm text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <Separator />

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 rounded bg-muted shrink-0 mt-0.5">
                    <faq.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{faq.question}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                {index < faqs.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open("https://docs.genlayer.com", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              GenLayer Documentation
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open("https://github.com/your-repo", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
