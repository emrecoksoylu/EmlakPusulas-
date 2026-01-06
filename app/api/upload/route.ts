import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const files = formData.getAll('images') as File[]

        if (files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 })
        }

        if (files.length > MAX_FILES) {
            return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 })
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            // Validate file
            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })
            }

            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 })
            }

            // Generate unique filename
            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substring(7)
            const ext = file.name.split('.').pop()
            const filename = `${timestamp}-${randomStr}.${ext}`

            // Convert File to ArrayBuffer then to Buffer
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('listing-images')
                .upload(filename, buffer, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.error('Supabase upload error:', error)
                return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('listing-images')
                .getPublicUrl(filename)

            console.log("Uploaded URL:", publicUrl)
            uploadedUrls.push(publicUrl)
        }

        return NextResponse.json({ urls: uploadedUrls }, { status: 200 })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
