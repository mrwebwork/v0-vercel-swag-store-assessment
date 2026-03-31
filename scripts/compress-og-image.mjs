import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicDir = join(__dirname, '..', 'public')

async function compressOgImage() {
  const inputPath = join(publicDir, 'og-image.png')
  const outputPath = join(publicDir, 'og-image-optimized.png')
  
  try {
    const info = await sharp(inputPath)
      .resize(1200, 630, { fit: 'cover' })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outputPath)
    
    console.log('Compressed OG image:', info)
    console.log(`Output: ${outputPath}`)
  } catch (err) {
    console.error('Error compressing image:', err)
  }
}

compressOgImage()
