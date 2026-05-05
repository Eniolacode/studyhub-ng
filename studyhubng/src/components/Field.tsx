export function Field({ label, htmlFor, children, dark = false }: { label: string; htmlFor: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={`mb-2 block text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
        {label}
      </label>
      {children}
    </div>
  )
}
