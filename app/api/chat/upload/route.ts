import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Allowed file types and their MIME types
const ALLOWED_FILE_TYPES = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  // Videos
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/quicktime': ['.mov'],
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt'],
  // Archives
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'application/x-7z-compressed': ['.7z']
}

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const threadId = formData.get('threadId') as string

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chat')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    for (const file of files) {
      // Validate file type
      const allowedExtensions = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]
      if (!allowedExtensions) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        )
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 10MB` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const fileExtension = path.extname(file.name)
      const uniqueFilename = `${uuidv4()}${fileExtension}`
      const filePath = path.join(uploadDir, uniqueFilename)

      // Save file to disk
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Create attachment record (mock data since we're not using database)
      const attachment = {
        id: uuidv4(),
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        filePath: `/uploads/chat/${uniqueFilename}`,
        threadId: threadId || null,
        messageId: null,
        uploadedBy: 'current-user', // Mock user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      uploadedFiles.push(attachment)
    }

    return NextResponse.json({
      success: true,
      data: uploadedFiles,
      message: `${uploadedFiles.length} file(s) uploaded successfully`
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const attachmentId = searchParams.get('id')

    if (!attachmentId) {
      return NextResponse.json(
        { error: 'Attachment ID is required' },
        { status: 400 }
      )
    }

    // Mock attachment data since we're not using database
    // In a real implementation, you would fetch from database
    const attachment = {
      id: attachmentId,
      filePath: `/uploads/chat/${attachmentId}.jpg` // Mock path
    }

    if (!attachment) {
      return NextResponse.json(
        { error: 'Attachment not found' },
        { status: 404 }
      )
    }

    // Delete file from disk
    try {
      const filePath = path.join(process.cwd(), 'public', attachment.filePath)
      await unlink(filePath)
    } catch (error) {
      console.error('Error deleting file from disk:', error)
      // Continue with database deletion even if file deletion fails
    }

    return NextResponse.json({
      success: true,
      message: 'Attachment deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete attachment' },
      { status: 500 }
    )
  }
}
