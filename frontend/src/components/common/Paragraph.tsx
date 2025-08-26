import React from 'react';
import '@styles/common/Paragraph.scss';

interface Props {
  paragraph: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Paragraph = ({ paragraph, className, style }: Props) => {
  return (
    <p className={`${className} paragraph-default`} style={style}>
      {paragraph}
    </p>
  );
};
