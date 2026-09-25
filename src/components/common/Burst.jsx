const Burst = ({ className = '' }) => (
  <svg className={`burst ${className}`} viewBox="0 0 200 200" aria-hidden="true">
    {Array.from({ length: 24 }, (_, index) => (
      <line key={index} x1="100" y1={index % 2 ? '65' : '46'} x2="100" y2={index % 2 ? '14' : '0'} transform={`rotate(${index * 15} 100 100)`} />
    ))}
  </svg>
);
export default Burst;
