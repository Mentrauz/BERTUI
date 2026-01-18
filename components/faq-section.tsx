"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is StructBERT and who is it for?",
    answer:
      "StructBERT is a specialized AI assistant for Data Structures and Algorithms. It's designed for students, developers, and professionals who want to master algorithmic concepts, understand complexity analysis, and learn efficient coding techniques.",
  },
  {
    question: "How does StructBERT help with algorithm analysis?",
    answer:
      "StructBERT provides precise Big O notation analysis, step-by-step algorithm breakdowns, and performance comparisons. You can explore different approaches to the same problem and understand trade-offs between time and space complexity.",
  },
  {
    question: "Can I get code implementations for data structures?",
    answer:
      "Absolutely! StructBERT offers clean, well-documented implementations of fundamental data structures like arrays, linked lists, trees, graphs, heaps, and hash tables, along with common algorithms and their applications.",
  },
  {
    question: "What programming languages does StructBERT support?",
    answer:
      "StructBERT provides code examples and explanations that can be adapted to any programming language. We focus on algorithmic concepts and design patterns that are language-agnostic, with implementations that demonstrate best practices.",
  },
  {
    question: "How does StructBERT handle complex algorithmic questions?",
    answer:
      "StructBERT specializes in DS&A topics including sorting algorithms, search techniques, graph algorithms, dynamic programming, and advanced data structures. We provide academic-level explanations with practical coding examples.",
  },
  {
    question: "How do I get started with StructBERT?",
    answer:
      "Getting started is simple! Sign up for your account and start asking questions about any DS&A topic. Whether you're preparing for interviews, learning new concepts, or optimizing existing code, StructBERT is here to help.",
  },
]

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            Master Data Structures & Algorithms with
            <br className="hidden md:block" />
            precise analysis and clean implementations.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index)

              return (
                <div key={index} className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-left hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
