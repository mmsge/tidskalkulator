'use client';

import { useState, useEffect, useCallback } from 'react';

type Props = {
  initialStart: string;
  initialHours: string;
  initialMinutes: string;
  initialHasBreak: boolean;
  initialBreakMin: string;
  autoCalculate: boolean;
};

type Result = { endTime: string; summary: string };

function computeResult(
  start: string,
  hours: string,
  minutes: string,
  hasBreak: boolean,
  breakMin: string,
): Result | null {
  if (!start) return null;

  const [startH, startM] = start.split(':').map(Number);
  const workH = parseInt(hours) || 0;
  const workM = parseInt(minutes) || 0;
  const bMin = hasBreak ? (parseInt(breakMin) || 0) : 0;

  const total = startH * 60 + startM + workH * 60 + workM + bMin;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

  const parts: string[] = [];
  if (workH > 0) parts.push(`${workH}h`);
  if (workM > 0) parts.push(`${workM}min`);
  const workLabel = parts.join(' ') || '0 min';

  let summary = `${start} + ${workLabel} arbeid`;
  if (hasBreak && bMin > 0) summary += ` + ${bMin} min pause`;

  return { endTime, summary };
}

export default function Calculator({
  initialStart,
  initialHours,
  initialMinutes,
  initialHasBreak,
  initialBreakMin,
  autoCalculate,
}: Props) {
  const [start, setStart] = useState(initialStart);
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const [hasBreak, setHasBreak] = useState(initialHasBreak);
  const [breakMin, setBreakMin] = useState(initialBreakMin);
  const [result, setResult] = useState<Result | null>(null);

  const calculate = useCallback(
    (s = start, h = hours, m = minutes, hb = hasBreak, bm = breakMin) => {
      const res = computeResult(s, h, m, hb, bm);
      if (!res) return;
      setResult(res);

      const params = new URLSearchParams();
      params.set('start', s);
      params.set('hours', h);
      params.set('minutes', m);
      params.set('break', hb ? '1' : '0');
      if (hb) params.set('breakMin', bm);
      history.replaceState(null, '', '?' + params.toString());
    },
    [start, hours, minutes, hasBreak, breakMin],
  );

  useEffect(() => {
    if (autoCalculate) {
      const res = computeResult(initialStart, initialHours, initialMinutes, initialHasBreak, initialBreakMin);
      if (res) setResult(res);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Enter') calculate(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [calculate]);

  return (
    <div className="card">
      <h1>Tidskalkulator</h1>

      <div className="field">
        <label htmlFor="start-time">Når byrja du i dag?</label>
        <input
          type="time"
          id="start-time"
          value={start}
          onChange={e => setStart(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="work-hours">Timar</label>
          <input
            type="number"
            id="work-hours"
            min={0}
            max={24}
            value={hours}
            onChange={e => setHours(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="work-minutes">Minutt</label>
          <input
            type="number"
            id="work-minutes"
            min={0}
            max={59}
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
          />
        </div>
      </div>

      <div className="break-row">
        <input
          type="checkbox"
          id="has-break"
          checked={hasBreak}
          onChange={e => setHasBreak(e.target.checked)}
        />
        <label htmlFor="has-break">Legg til pause</label>
      </div>

      {hasBreak && (
        <div className="break-duration-field field">
          <label htmlFor="break-minutes">Pauselengd (minutt)</label>
          <input
            type="number"
            id="break-minutes"
            min={1}
            max={480}
            value={breakMin}
            onChange={e => setBreakMin(e.target.value)}
          />
        </div>
      )}

      <button onClick={() => calculate()}>Rekn ut</button>

      {result && (
        <div className="result">
          <p>Du kan gå heim klokka</p>
          <div className="end-time">{result.endTime}</div>
          <div className="summary">{result.summary}</div>
        </div>
      )}
    </div>
  );
}
