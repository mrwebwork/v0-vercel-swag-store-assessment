import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Vercel Swag Store - Premium developer merchandise'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #000000 0%, #171719 50%, #0a0a0a 100%)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Background pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 0%, transparent 50%)',
            display: 'flex',
          }}
        />

        {/* Top section with logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Vercel Triangle Logo */}
          <svg
            width="48"
            height="48"
            viewBox="0 0 76 65"
            fill="none"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#ffffff" />
          </svg>
          <span
            style={{
              color: '#ffffff',
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: '-0.02em',
            }}
          >
            Vercel
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 24,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Official Merchandise
            </span>
            <span
              style={{
                color: '#ffffff',
                fontSize: 72,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Vercel Swag Store
            </span>
          </div>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 28,
              fontWeight: 400,
              maxWidth: '700px',
              lineHeight: 1.4,
            }}
          >
            Premium hoodies, t-shirts, caps, and accessories for modern developers.
          </span>
        </div>

        {/* Bottom section with CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: '8px',
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                SHOP NOW
              </span>
            </div>
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: 18,
              }}
            >
              Use code BUNDLE10 for 10% off
            </span>
          </div>
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: 16,
            }}
          >
            swag.vercel.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
