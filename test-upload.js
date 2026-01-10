// Test script to verify Supabase upload works
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
console.log('Supabase Key:', supabaseAnonKey ? '✓ Set' : '✗ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('\n❌ Supabase credentials are missing!')
    console.log('Please check your .env.local file')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testUpload() {
    try {
        // Create a simple test file
        const testContent = Buffer.from('Test upload from script')
        const filename = `test-${Date.now()}.txt`

        console.log('\nTesting upload to listing-images bucket...')

        const { data, error } = await supabase.storage
            .from('listing-images')
            .upload(filename, testContent, {
                contentType: 'text/plain',
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('❌ Upload failed:', error.message)
            console.error('Error details:', error)
            return
        }

        console.log('✅ Upload successful!')
        console.log('File path:', data.path)

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(filename)

        console.log('Public URL:', publicUrl)

        // Clean up - delete test file
        const { error: deleteError } = await supabase.storage
            .from('listing-images')
            .remove([filename])

        if (deleteError) {
            console.warn('⚠️  Could not delete test file:', deleteError.message)
        } else {
            console.log('✅ Test file cleaned up')
        }

    } catch (err) {
        console.error('❌ Test failed:', err.message)
        console.error(err)
    }
}

testUpload()
