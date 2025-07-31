import React from 'react';
import '@/styles/common/Title.scss';

interface Props {
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Title = ({ title, className, style }: Props) => {
  return (
    <h1 className={`title-default ${className}`} style={style}>
      {title}
    </h1>
  );
};
