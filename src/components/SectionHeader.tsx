import { Fragment } from "react";

type SectionHeaderProps = {
  /** Kept for call-site readability; sections are identified by their headline instead. */
  index?: string;
  label?: string;
  title: string;
  copy?: string;
};

export function SectionHeader({ title, copy }: SectionHeaderProps) {
  return (
    <div className="section-header">
      {/* Words are wrapped so the scroll engine can lift each one out of a mask. */}
      <h2 data-words aria-label={title}>
        {title.split(" ").map((word, position) => (
          <Fragment key={`${word}-${position}`}>
            <b className="word" aria-hidden="true">
              <b>{word}</b>
            </b>{" "}
          </Fragment>
        ))}
      </h2>
      {copy ? (
        <p>{copy}</p>
      ) : null}
    </div>
  );
}
