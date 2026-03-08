import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Change to Node runtime to allow file reading
export const runtime = 'nodejs';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  try {
    // Read logo.png from public folder
    const logoPath = join(process.cwd(), 'public', 'logo.png');
    const logoBuffer = readFileSync(logoPath);
    
    // Return the actual logo file
    return new Response(logoBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Failed to load logo.png:', error);
    
    // Fallback to generated icon
    return new ImageResponse(
      (
        <div
          tw="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2]"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div tw="text-white text-[280px] font-bold">M</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
