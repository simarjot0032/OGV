import React from 'react';
import '@/styles/common/Paragraph.scss';

interface Props {
  paragraph: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Paragraph = ({ paragraph, className, style }: Props) => {
  return (
    <h2 className={`paragraph-default ${className}`} style={style}>
      {paragraph}
    </h2>
  );
};
