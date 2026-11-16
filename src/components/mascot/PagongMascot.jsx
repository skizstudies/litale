/**
 * Pagong — Litale's calm turtle guide. Flat vector, front-facing, one flipper
 * raised in a gentle (static) wave. Purely decorative unless `title` is passed.
 */
export default function PagongMascot({ className = '', title }) {
  const ink = '#1B2E20';
  const skin = '#A9D39E';
  const shell = '#3F8A4C';
  const shellDark = '#2B6E38';
  const belly = '#FBF1C4';

  return (
    <svg
      viewBox="0 0 220 220"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* soft ground shadow */}
      <ellipse cx="110" cy="206" rx="72" ry="8" fill="#E5F1DF" />

      {/* feet */}
      <ellipse cx="78" cy="190" rx="21" ry="12" fill={skin} stroke={ink} strokeWidth="4" />
      <ellipse cx="142" cy="190" rx="21" ry="12" fill={skin} stroke={ink} strokeWidth="4" />

      {/* resting arm (left) */}
      <ellipse
        cx="50"
        cy="150"
        rx="13"
        ry="24"
        transform="rotate(22 50 150)"
        fill={skin}
        stroke={ink}
        strokeWidth="4"
      />

      {/* waving arm (right) */}
      <ellipse
        cx="176"
        cy="104"
        rx="13"
        ry="27"
        transform="rotate(28 176 104)"
        fill={skin}
        stroke={ink}
        strokeWidth="4"
      />
      {/* little wave marks */}
      <path d="M196 66 Q205 72 204 84" fill="none" stroke={shellDark} strokeWidth="4" strokeLinecap="round" />
      <path d="M206 56 Q219 66 217 84" fill="none" stroke={shellDark} strokeWidth="4" strokeLinecap="round" />

      {/* shell */}
      <ellipse cx="110" cy="150" rx="64" ry="50" fill={shell} stroke={ink} strokeWidth="4" />
      <path d="M52 132 Q60 118 72 112" fill="none" stroke={shellDark} strokeWidth="4" strokeLinecap="round" />
      <path d="M168 132 Q160 118 148 112" fill="none" stroke={shellDark} strokeWidth="4" strokeLinecap="round" />

      {/* belly plate */}
      <ellipse cx="110" cy="156" rx="42" ry="38" fill={belly} stroke={ink} strokeWidth="3.5" />
      <path d="M78 146 H142" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <path d="M76 168 H144" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.35" />
      <path d="M110 120 V192" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.35" />

      {/* head */}
      <circle cx="110" cy="72" r="42" fill={skin} stroke={ink} strokeWidth="4" />
      <ellipse cx="110" cy="40" rx="10" ry="5" fill="#BFE0B5" />

      {/* eyes */}
      <ellipse cx="94" cy="70" rx="6.5" ry="7.5" fill={ink} />
      <ellipse cx="126" cy="70" rx="6.5" ry="7.5" fill={ink} />
      <circle cx="96.5" cy="67" r="2.2" fill="#FFFFFF" />
      <circle cx="128.5" cy="67" r="2.2" fill="#FFFFFF" />

      {/* cheeks */}
      <ellipse cx="81" cy="87" rx="8" ry="5" fill="#F2B8A2" opacity="0.75" />
      <ellipse cx="139" cy="87" rx="8" ry="5" fill="#F2B8A2" opacity="0.75" />

      {/* calm smile */}
      <path d="M99 88 Q110 98 121 88" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
