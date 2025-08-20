import { MouseEvent } from 'react';

export { HamburgerIcon } from './Hamburger.icon';
export { ExploreIcon } from './Explore.icon';
export { UploadIcon } from './Upload.icon';
export { PreviewIcon } from './Preview.icon';
export { CrossIcon } from './Cross.icon';
export { FileIcon } from './File.icon';
export { SearchIcon } from './Search.icon';

export type IconProps = {
  onClick?: (_?: MouseEvent<SVGSVGElement>) => void;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  [key: string]: any;
};
