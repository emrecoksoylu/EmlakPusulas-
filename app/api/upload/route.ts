import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { auth } from "@/auth"

export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
    console.log('=== UPLOAD API CALLED ===')
    try {
        console.log('1. Checking authentication...')
        const session = await auth()
        if (!session?.user) {
            console.error('❌ Auth failed: No session')
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        console.log('✓ Auth successful:', session.user.email)

        console.log('2. Parsing form data...')
        const formData = await request.formData()
        const files = formData.getAll('images') as File[]
        console.log(`✓ Received ${files.length} files`)

        if (files.length === 0) {
            console.error('❌ No files in request')
            return NextResponse.json({ error: "No files provided" }, { status: 400 })
        }

        if (files.length > MAX_FILES) {
            console.error(`❌ Too many files: ${files.length}`)
            return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 })
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            console.log(`\n3. Processing file: ${file.name}`)
            console.log(`   - Type: ${file.type}`)
            console.log(`   - Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`)

            // Validate file
            if (!ALLOWED_TYPES.includes(file.type)) {
                console.error(`❌ Invalid type: ${file.type}`)
                return NextResponse.json({ error: `Invalid file type: ${file.type}` }, { status: 400 })
            }

            if (file.size > MAX_FILE_SIZE) {
                console.error(`❌ File too large: ${file.size} bytes`)
                return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 })
            }

            // Generate unique filename
            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substring(7)
            const ext = file.name.split('.').pop()
            const filename = `${timestamp}-${randomStr}.${ext}`
            console.log(`   - Generated filename: ${filename}`)

            // Convert File to ArrayBuffer then to Buffer
            console.log('4. Converting file to buffer...')
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            console.log(`✓ Buffer created: ${buffer.length} bytes`)

            // Upload to Supabase Storage
            console.log('5. Uploading to Supabase...')
            console.log(`   - Bucket: listing-images`)
            console.log(`   - Filename: ${filename}`)

            const { data, error } = await supabase.storage
                .from('listing-images')
                .upload(filename, buffer, {
                    contentType: file.type,
                    cacheControl: '3600',
                    upsert: false
                })

            if (error) {
                console.error('❌ Supabase upload error:', error)
                console.error('   - Message:', error.message)
                console.error('   - Details:', JSON.stringify(error))
                return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
            }

            console.log('✓ Upload successful:', data.path)

            // Get public URL
            console.log('6. Getting public URL...')
            const { data: { publicUrl } } = supabase.storage
                .from('listing-images')
                .getPublicUrl(filename)

            console.log('✓ Public URL:', publicUrl)
            uploadedUrls.push(publicUrl)
        }

        console.log(`\n=== UPLOAD COMPLETE: ${uploadedUrls.length} files ===`)
        return NextResponse.json({ urls: uploadedUrls }, { status: 200 })
    } catch (error) {
        console.error('❌ FATAL ERROR in upload API:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
}
