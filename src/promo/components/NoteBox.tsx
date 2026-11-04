/** Note box: off-white, 18px radius, a bold label, one to three sentences. At most two per page. */
export function NoteBox({ label = 'Note', children, className = '' }: { label?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-note p-body ${className}`} role="note">
      <p>
        <strong>{label}</strong> {children}
      </p>
    </div>
  )
}
