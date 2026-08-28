import { ImageResponse } from 'next/og'
import { seasonTag } from '@/lib/utils'

export const runtime = 'edge'

const BRACKET = 'rgba(242,238,248,0.45)'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050408',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Ambient violet glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(123,47,190,0.22) 0%, rgba(5,4,8,0) 65%)',
            display: 'flex',
          }}
        />

        {/* HUD corner brackets */}
        <div style={{ position: 'absolute', top: 40, left: 40, width: 36, height: 36, borderTop: `2px solid ${BRACKET}`, borderLeft: `2px solid ${BRACKET}`, display: 'flex' }} />
        <div style={{ position: 'absolute', top: 40, right: 40, width: 36, height: 36, borderTop: `2px solid ${BRACKET}`, borderRight: `2px solid ${BRACKET}`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 40, left: 40, width: 36, height: 36, borderBottom: `2px solid ${BRACKET}`, borderLeft: `2px solid ${BRACKET}`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 40, right: 40, width: 36, height: 36, borderBottom: `2px solid ${BRACKET}`, borderRight: `2px solid ${BRACKET}`, display: 'flex' }} />

        {/* Telemetry labels */}
        <div style={{ position: 'absolute', top: 48, left: 96, fontSize: 18, letterSpacing: 6, color: '#9A92A8', display: 'flex' }}>
          {`SZN ${seasonTag()} // LIVE`}
        </div>
        <div style={{ position: 'absolute', bottom: 48, right: 96, fontSize: 18, letterSpacing: 6, color: '#9A92A8', display: 'flex' }}>
          ENTER THE ARENA
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 200,
              fontWeight: 800,
              color: '#F2EEF8',
              letterSpacing: 4,
              lineHeight: 1,
              display: 'flex',
            }}
          >
            DAG
          </div>
          <div
            style={{
              fontSize: 26,
              color: '#9A92A8',
              letterSpacing: 10,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            DRUSHYA ANIMATIONS & GAMING
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 20,
              color: '#FFB703',
              letterSpacing: 6,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            WHERE GAMING MEETS ANIMATION
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
