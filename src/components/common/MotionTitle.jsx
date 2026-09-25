// Each line has a separate mask. The real text remains selectable and accessible.
const MotionTitle = ({ as: Tag = 'h2', lines, className = 'display-title', id }) => (
  <Tag className={className} id={id} data-reveal>
    {lines.map((line, index) => <span className="motion-line-mask" key={index}>
      <span className="motion-line" data-motion="line">{line}</span>{index < lines.length - 1 ? ' ' : ''}
    </span>)}
  </Tag>
);
export default MotionTitle;
