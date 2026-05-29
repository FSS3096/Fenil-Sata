type SectionHeaderProps = {
  index: string;
  label: string;
  title: string;
  copy?: string;
  invert?: boolean;
};

export function SectionHeader({
  index,
  label,
  title,
  copy,
  invert = false
}: SectionHeaderProps) {
  return (
    <div className="section-header" data-gsap-reveal>
      <div className="section-kicker">
        <span>{index}</span>
        <span>{label}</span>
      </div>
      <h2 className={invert ? "text-ivory" : "text-ivory"}>{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}
