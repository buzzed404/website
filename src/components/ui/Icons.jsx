const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
);

export const HeartIcon = ({ filled, ...props }) => (
  <svg viewBox="0 0 24 24" {...common} fill={filled ? "currentColor" : "none"} {...props}>
    <path d="M12 20s-7-4.35-9.5-8.5C.7 8.2 2.2 4.5 6 4.5c2 0 3.5 1.2 6 3.5 2.5-2.3 4-3.5 6-3.5 3.8 0 5.3 3.7 3.5 7C19 15.65 12 20 12 20z" />
  </svg>
);

export const BagIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M6 8h12l-1 12H7z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const MenuIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const TrashIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0-1 13a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2L7 7" />
  </svg>
);

export const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M5 12l5 5L19 8" />
  </svg>
);

export const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

export const XIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);

export const TiktokIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" />
    <path d="M14 4c0 2.5 2 4.5 4.5 4.5" />
  </svg>
);

export const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <rect x="3" y="6" width="18" height="12" rx="3" />
    <path d="M11 10l4 2-4 2z" fill="currentColor" stroke="none" />
  </svg>
);

export const TruckIcon = (props) => (
  <svg viewBox="0 0 24 24" {...common} {...props}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 11h4l3 3v2h-7z" />
    <circle cx="7" cy="18" r="1.6" />
    <circle cx="17.5" cy="18" r="1.6" />
  </svg>
);
