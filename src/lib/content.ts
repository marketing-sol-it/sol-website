import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

// One reader for the whole build. Pages are prerendered, so every read
// happens at build time against the files in src/content.
export const reader = createReader(process.cwd(), keystaticConfig);

export type Event = NonNullable<Awaited<ReturnType<typeof reader.collections.events.read>>> & { slug: string };
export type Position = NonNullable<Awaited<ReturnType<typeof reader.collections.positions.read>>> & { slug: string };
export type Partner = NonNullable<Awaited<ReturnType<typeof reader.collections.partners.read>>> & { slug: string };
export type Member = NonNullable<Awaited<ReturnType<typeof reader.collections.team.read>>> & { slug: string };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Today at midnight, local time. */
export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(iso: string): { day: number; mon: string; year: number; long: string } {
  const d = parseDate(iso);
  return {
    day: d.getDate(),
    mon: MONTHS[d.getMonth()],
    year: d.getFullYear(),
    long: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  };
}

export const FORMAT_LABEL: Record<string, string> = {
  panel: 'Panel',
  workshop: 'Workshop',
  competition: 'Competition',
  community: 'Community',
};

export async function getEvents() {
  const all = (await reader.collections.events.all()).map((e) => ({ slug: e.slug, ...e.entry })) as Event[];
  const visible = all.filter((e) => !e.hidden && e.date);
  const t = today();
  const upcoming = visible.filter((e) => parseDate(e.date!) >= t).sort((a, b) => (a.date! < b.date! ? -1 : 1));
  const past = visible.filter((e) => parseDate(e.date!) < t).sort((a, b) => (a.date! < b.date! ? 1 : -1));
  return { upcoming, past };
}

export async function getPositions() {
  const all = (await reader.collections.positions.all()).map((p) => ({ slug: p.slug, ...p.entry })) as Position[];
  return all.sort((a, b) => (a.order ?? 10) - (b.order ?? 10));
}

export async function getPartners() {
  const all = (await reader.collections.partners.all()).map((p) => ({ slug: p.slug, ...p.entry })) as Partner[];
  return all.filter((p) => p.permissionConfirmed).sort((a, b) => (a.order ?? 10) - (b.order ?? 10));
}

export async function getTeam() {
  const all = (await reader.collections.team.all()).map((m) => ({ slug: m.slug, ...m.entry })) as Member[];
  const sorted = all.sort((a, b) => (a.order ?? 10) - (b.order ?? 10));
  return {
    leadership: sorted.filter((m) => m.group === 'leadership'),
    advisory: sorted.filter((m) => m.group === 'advisory'),
  };
}

export async function getSettings() {
  const s = await reader.singletons.settings.read();
  if (!s) throw new Error('src/content/settings.yaml is missing');
  return s;
}

export async function getAbout() {
  const a = await reader.singletons.about.read();
  if (!a) throw new Error('src/content/about.yaml is missing');
  return a;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function mailto(email: string, subject: string, body?: string): string {
  const q = new URLSearchParams();
  q.set('subject', subject);
  if (body) q.set('body', body);
  return `mailto:${email}?${q.toString().replace(/\+/g, '%20')}`;
}
