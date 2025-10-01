import React, { useState } from 'react';
import s from './ReadMore.module.scss';

interface ReadMoreProps {
  text: string;
  maxLength?: number;
}

function ReadMoreComponent({ text, maxLength = 100 }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span className={s.readMore}>{text}</span>;
  }

  return (
    <span className={s.readMore}>
      {expanded ? text : text.slice(0, maxLength) + '...'}
      <button
        className={s.button}
        onClick={() => setExpanded(v => !v)}
        type="button"
      >
        {expanded ? 'Ler menos' : 'Ler mais'}
      </button>
    </span>
  );
}

export default React.memo(ReadMoreComponent);
