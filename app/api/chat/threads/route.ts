import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma-client'

// GET /api/chat/threads - Get all chat threads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Mock data for now - replace with actual database queries
    const mockThreads = [
      {
        id: '1',
        title: 'General Discussion',
        description: 'Company-wide announcements and discussions',
        category: 'general',
        isPinned: true,
        isLocked: false,
        createdBy: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: {
          id: 'user1',
          email: 'admin@company.com',
          employee: {
            name: 'Admin User',
            employeeId: 'ADMIN001'
          }
        },
        _count: {
          messages: 15,
          attachments: 3
        }
      },
      {
        id: '2',
        title: 'Production Issues',
        description: 'Discuss production-related problems and solutions',
        category: 'production',
        isPinned: false,
        isLocked: false,
        createdBy: 'user2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creator: {
          id: 'user2',
          email: 'manager@company.com',
          employee: {
            name: 'Production Manager',
            employeeId: 'MGR001'
          }
        },
        _count: {
          messages: 8,
          attachments: 2
        }
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockThreads,
      pagination: {
        page,
        limit,
        total: mockThreads.length,
        pages: Math.ceil(mockThreads.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching chat threads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat threads' },
      { status: 500 }
    )
  }
}

// POST /api/chat/threads - Create a new chat thread
export async function POST(request: NextRequest) {
  try {
    const { title, description, category = 'general' } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Mock thread creation
    const newThread = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim() || null,
      category,
      isPinned: false,
      isLocked: false,
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: {
        id: 'current-user',
        email: 'user@company.com',
        employee: {
          name: 'Current User',
          employeeId: 'EMP001'
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: newThread
    })
  } catch (error) {
    console.error('Error creating chat thread:', error)
    return NextResponse.json(
      { error: 'Failed to create chat thread' },
      { status: 500 }
    )
  }
}
