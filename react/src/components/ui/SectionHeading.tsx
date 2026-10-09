import './SectionHeading.scss';

interface SectionHeadingProps {
  id?: string;
  title: string;
  text: string;
}

export const SectionHeading = ({ id, title, text }: SectionHeadingProps) => (
  <header className="section-heading">
    <h2 id={id} className="section-heading__title">
      {title}
    </h2>
    <p className="section-heading__text">{text}</p>
  </header>
);
