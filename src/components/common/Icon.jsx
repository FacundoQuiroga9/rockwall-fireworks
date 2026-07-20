const iconPaths = {
  location: (
    <>
      <path d="M12 21s6-5.2 6-12a6 6 0 1 0-12 0c0 6.8 6 12 6 12Z" />
      <circle cx="12" cy="9" r="2.2" />
    </>
  ),
  phone: (
    <path d="M7.1 3.5 4.5 5.2c-.7.5-.9 1.4-.5 2.2 3 6 6.6 9.6 12.6 12.6.8.4 1.7.2 2.2-.5l1.7-2.6-4.6-3-1.7 2.1c-2.6-1.4-4.8-3.6-6.2-6.2l2.1-1.7-3-4.6Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  social: (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <path d="M9 18.5h6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" className="icon-fill" />
    </>
  ),
  facebook: (
    <path
      className="icon-fill"
      d="M14.2 22v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H8V14h2.8v8h3.4Z"
    />
  ),
};

const Icon = ({ name }) => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    {iconPaths[name] ?? iconPaths.social}
  </svg>
);

export default Icon;
