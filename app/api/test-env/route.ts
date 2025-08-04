import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // Check environment variables (without exposing sensitive data)
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    GODADDY_API_KEY: process.env.GODADDY_API_KEY ? `Set (${process.env.GODADDY_API_KEY.length} chars)` : 'NOT SET',
    GODADDY_API_SECRET: process.env.GODADDY_API_SECRET ? `Set (${process.env.GODADDY_API_SECRET.length} chars)` : 'NOT SET',
    GODADDY_PLID: process.env.GODADDY_PLID || 'NOT SET',
    GODADDY_RESELLER_API_BASE_URL: process.env.GODADDY_RESELLER_API_BASE_URL || 'NOT SET',
    API_SECRET_KEY: process.env.API_SECRET_KEY ? 'Set' : 'NOT SET',
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY ? 'Set' : 'NOT SET',
  }

  console.log('Environment check:', envCheck)

  return NextResponse.json({
    message: 'Environment variables check',
    env: envCheck,
    timestamp: new Date().toISOString()
  })
}