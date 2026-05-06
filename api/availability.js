/* Vercel serverless function — proxies & parses Airbnb iCal export.
 *
 * Env var required: AIRBNB_ICAL_URL
 * (Airbnb listing → Calendar → Sync calendars → Export Calendar → copy URL)
 *
 * Returns: { bookings: [{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }, ...] }
 * `end` is exclusive — the first night that is free again.
 */

export default async function handler(req, res) {
  const url = process.env.AIRBNB_ICAL_URL;

  // Edge cache: 15min fresh, 30min SWR. Airbnb iCals only refresh hourly anyway.
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');

  if (!url) {
    return res.status(200).json({
      bookings: [],
      note: 'AIRBNB_ICAL_URL env var not set'
    });
  }

  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'arum-house/1.0' } });
    if (!r.ok) throw new Error('iCal fetch failed: ' + r.status);
    const ical = await r.text();
    const bookings = parseICal(ical);
    return res.status(200).json({ bookings });
  } catch (err) {
    return res.status(200).json({
      bookings: [],
      note: 'fetch_failed',
      error: String(err && err.message || err)
    });
  }
}

function parseICal(text) {
  const events = [];
  // Split into VEVENT blocks
  const blocks = text.split('BEGIN:VEVENT').slice(1);
  for (const block of blocks) {
    const startMatch = block.match(/DTSTART[^:]*:(\d{8})(?:T\d{6}Z?)?/);
    const endMatch   = block.match(/DTEND[^:]*:(\d{8})(?:T\d{6}Z?)?/);
    if (!startMatch || !endMatch) continue;
    events.push({
      start: ymd(startMatch[1]),
      end:   ymd(endMatch[1])
    });
  }
  return events;
}

function ymd(s) {
  // "20260115" → "2026-01-15"
  return s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8);
}
