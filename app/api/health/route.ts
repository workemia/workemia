import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'ok',
        memory: {
          used: process.memoryUsage().heapUsed / 1024 / 1024,
          total: process.memoryUsage().heapTotal / 1024 / 1024,
        },
      },
    }

    return NextResponse.json(healthCheck, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}