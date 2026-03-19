import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

function calcEndTime(start: string, hours: number, minutes: number, breakMin: number): string {
  const [startH, startM] = start.split(':').map(Number);
  const total = startH * 60 + startM + hours * 60 + minutes + breakMin;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const start = searchParams.get('start') ?? '';
  const hours = parseInt(searchParams.get('hours') ?? '8');
  const minutes = parseInt(searchParams.get('minutes') ?? '0');
  const hasBreak = searchParams.get('break') === '1';
  const breakMin = hasBreak ? parseInt(searchParams.get('breakMin') ?? '30') : 0;

  const endTime = start ? calcEndTime(start, hours, minutes, breakMin) : null;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}t`);
  if (minutes > 0) parts.push(`${minutes}min`);
  const workLabel = parts.join(' ') || '0 min';

  let summary = start ? `${start} + ${workLabel} arbeid` : '';
  if (hasBreak && breakMin > 0) summary += ` + ${breakMin} min pause`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '64px 96px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 48px rgba(0,0,0,0.10)',
            minWidth: '760px',
          }}
        >
          <div
            style={{
              fontSize: '26px',
              fontWeight: '600',
              color: '#888',
              marginBottom: '32px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Tidskalkulator
          </div>

          {endTime ? (
            <>
              <div style={{ fontSize: '22px', color: '#555', marginBottom: '16px' }}>
                Du kan gå heim klokka
              </div>
              <div
                style={{
                  fontSize: '128px',
                  fontWeight: '700',
                  color: '#4f7ef8',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {endTime}
              </div>
              <div style={{ fontSize: '22px', color: '#999', marginTop: '28px' }}>
                {summary}
              </div>
            </>
          ) : (
            <div style={{ fontSize: '28px', color: '#555' }}>
              Rekn ut når arbeidsdagen din sluttar
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
