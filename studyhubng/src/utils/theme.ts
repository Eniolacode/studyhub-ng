export function getSubjectColor(subject: string): string {
  const normalized = subject.toLowerCase();
  if (normalized.includes('math') || normalized.includes('calculus')) {
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  }
  if (normalized.includes('bio')) {
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  }
  if (normalized.includes('chem')) {
    return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
  }
  if (normalized.includes('phys')) {
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  }
  if (normalized.includes('gst') || normalized.includes('general')) {
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  }
  if (normalized.includes('eng') || normalized.includes('tech')) {
    return 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20';
  }
  if (normalized.includes('law')) {
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  }
  if (normalized.includes('med') || normalized.includes('nurs')) {
    return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
  }
  if (normalized.includes('comp')) {
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  }
  return 'text-slate-300 bg-slate-500/10 border-slate-500/20';
}
