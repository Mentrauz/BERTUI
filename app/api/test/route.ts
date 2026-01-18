import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  try {
    const apiKey = process.env.GEMINIAPI_KEY

    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        error: 'GEMINIAPI_KEY environment variable not set'
      }, { status: 500 })
    }

    if (!apiKey.startsWith('AIza')) {
      return NextResponse.json({
        status: 'error',
        error: 'API key does not have correct format (should start with AIza)'
      }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    // Test basic model creation
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Test simple generation
    const result = await model.generateContent('Hello, test message')
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      status: 'success',
      message: 'API connection successful',
      api_key_format: 'valid',
      model: 'gemini-1.5-flash',
      test_response: text.substring(0, 100) + (text.length > 100 ? '...' : '')
    })

  } catch (error) {
    console.error('Test API error:', error)

    let errorMessage = 'Unknown error'
    if (error instanceof Error) {
      errorMessage = error.message
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 500)
      })
    }

    return NextResponse.json({
      status: 'error',
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}