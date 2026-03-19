import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Calculator from './Calculator';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function getParam(params: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const val = params[key];
  return Array.isArray(val) ? val[0] : val;
}

function calcEndTime(start: string, hours: number, minutes: number, breakMin: number): string {
  const [startH, startM] = start.split(':').map(Number);
  const total = startH * 60 + startM + hours * 60 + minutes + breakMin;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export async function generateMetadata(props: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await props.searchParams;
  const headersList = await headers();

  const host = headersList.get('host') ?? 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const start = getParam(params, 'start');
  const hours = parseInt(getParam(params, 'hours') ?? '8');
  const minutes = parseInt(getParam(params, 'minutes') ?? '0');
  const hasBreak = getParam(params, 'break') === '1';
  const breakMin = hasBreak ? parseInt(getParam(params, 'breakMin') ?? '30') : 0;

  const ogParams = new URLSearchParams();
  if (start) {
    ogParams.set('start', start);
    ogParams.set('hours', String(hours));
    ogParams.set('minutes', String(minutes));
    ogParams.set('break', hasBreak ? '1' : '0');
    if (hasBreak) ogParams.set('breakMin', String(breakMin));
  }
  const ogImageUrl = `${baseUrl}/api/og${ogParams.size > 0 ? '?' + ogParams.toString() : ''}`;

  let title = 'Tidskalkulator';
  let description = 'Rekn ut når arbeidsdagen din sluttar. Skriv inn starttid, arbeidstid og pause — og få sluttida med ein gong.';

  if (start) {
    const endTime = calcEndTime(start, hours, minutes, breakMin);
    title = `Sluttar ${endTime} — Tidskalkulator`;
    description = `Startar ${start}, sluttar ${endTime}.`;
    if (hasBreak && breakMin > 0) description += ` Inkluderer ${breakMin} min pause.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    other: {
      'fediverse:creator': '@markus@skvip.lol',
    },
  };
}

export default async function Home(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;

  return (
    <Calculator
      initialStart={getParam(params, 'start') ?? '08:00'}
      initialHours={getParam(params, 'hours') ?? '8'}
      initialMinutes={getParam(params, 'minutes') ?? '0'}
      initialHasBreak={getParam(params, 'break') === '1'}
      initialBreakMin={getParam(params, 'breakMin') ?? '30'}
      autoCalculate={!!getParam(params, 'start')}
    />
  );
}
