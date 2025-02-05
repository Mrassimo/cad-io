import React, { useState } from 'react'
import CascadeStudio from '@/components/studio/CascadeStudio'
import { CommandProcessor, ProcessedCommand } from '@/lib/ai/commandProcessor'

export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [currentSelection, setCurrentSelection] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMessage = async (message: string) => {
    setIsProcessing(true)
    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }])

      // Process command
      let processedCommand: ProcessedCommand
      if (currentSelection) {
        processedCommand = await CommandProcessor.processSelectionCommand(message, currentSelection)
      } else {
        processedCommand = await CommandProcessor.processComplexCommand(message)
      }

      // Add AI response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: processedCommand.error || processedCommand.context 
      }])

    } catch (error) {
      console.error('Error processing message:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectionChange = (selection: any) => {
    setCurrentSelection(selection)
  }

  const handleOperationComplete = (result: any) => {
    // Handle operation completion, maybe update UI or show success message
    console.log('Operation completed:', result)
  }

  return (
    <main className="flex h-screen">
      {/* CAD Viewport */}
      <div className="flex-1 h-full">
        <CascadeStudio
          onSelectionChange={handleSelectionChange}
          onOperationComplete={handleOperationComplete}
        />
      </div>

      {/* Chat Interface */}
      <div className="w-96 h-full flex flex-col bg-white border-l">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 ${
                msg.role === 'assistant' ? 'bg-blue-50' : 'bg-gray-50'
              } p-3 rounded-lg`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement
              if (input.value.trim()) {
                handleMessage(input.value)
                input.value = ''
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              name="message"
              placeholder="Type your command..."
              className="flex-1 px-3 py-2 border rounded-lg"
              disabled={isProcessing}
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 