/** Every section starts with an H2 and a one-sentence description. */
export function SectionHead({ id, title, lead }: { id: string; title: string; lead: string }) {
  return (
    <div className="p-text">
      <h2 id={id} className="p-h2">
        {title}
      </h2>
      <p className="p-intro mt-3">{lead}</p>
    </div>
  )
}
