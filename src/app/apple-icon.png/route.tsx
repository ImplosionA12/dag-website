import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#050408',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 50% 45%, rgba(123,47,190,0.35) 0%, rgba(5,4,8,0) 70%)',
            display: 'flex',
          }}
        />
        <div style={{ position: 'absolute', top: 18, left: 18, width: 16, height: 16, borderTop: '3px solid rgba(242,238,248,0.5)', borderLeft: '3px solid rgba(242,238,248,0.5)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 18, right: 18, width: 16, height: 16, borderBottom: '3px solid rgba(242,238,248,0.5)', borderRight: '3px solid rgba(242,238,248,0.5)', display: 'flex' }} />
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            color: '#F2EEF8',
            display: 'flex',
          }}
        >
          D
        </div>
      </div>
    ),
    {
      width: 180,
      height: 180,
    }
  )
}
