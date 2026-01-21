import { NextRequest, NextResponse } from 'next/server'

// GET /api/chat/messages - Get messages for a thread
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const threadId = searchParams.get('threadId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = (page - 1) * limit

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      )
    }

    // Mock messages data
    const mockMessages = [
      {
        id: '1',
        content: 'Welcome to the company chat! This is a great platform for team communication.',
        threadId,
        senderId: 'user1',
        isEdited: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        sender: {
          id: 'user1',
          email: 'admin@company.com',
          employee: {
            name: 'Admin User',
            employeeId: 'ADMIN001'
          }
        },
        attachments: []
      },
      {
        id: '2',
        content: 'Thanks! This looks really helpful for our team coordination.',
        threadId,
        senderId: 'user2',
        isEdited: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        updatedAt: new Date(Date.now() - 1800000).toISOString(),
        sender: {
          id: 'user2',
          email: 'manager@company.com',
          employee: {
            name: 'Production Manager',
            employeeId: 'MGR001'
          }
        },
        attachments: []
      },
      {
        id: '3',
        content: 'I agree! The file sharing feature will be very useful for sharing documents and images.',
        threadId,
        senderId: 'user3',
        isEdited: false,
        createdAt: new Date(Date.now() - 900000).toISOString(),
        updatedAt: new Date(Date.now() - 900000).toISOString(),
        sender: {
          id: 'user3',
          email: 'employee@company.com',
          employee: {
            name: 'Team Member',
            employeeId: 'EMP001'
          }
        },
        attachments: [
          {
            id: 'att1',
            filename: 'document.pdf',
            originalName: 'Project_Document.pdf',
            mimeType: 'application/pdf',
            fileSize: 1024000,
            filePath: '/uploads/chat/document.pdf'
          }
        ]
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockMessages,
      pagination: {
        page,
        limit,
        total: mockMessages.length,
        pages: Math.ceil(mockMessages.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST /api/chat/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const { content, threadId, parentId } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      )
    }

    // Mock message creation
    const newMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      threadId,
      senderId: 'current-user',
      parentId: parentId || null,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sender: {
        id: 'current-user',
        email: 'user@company.com',
        employee: {
          name: 'Current User',
          employeeId: 'EMP001'
        }
      },
      attachments: []
    }

    return NextResponse.json({
      success: true,
      data: newMessage
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
