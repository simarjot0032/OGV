import { ExploreIcon, UploadIcon } from '@/icons';

interface SideBarData {
  title: string;
  icon: React.ComponentType;
  link: string;
}

export const SideBarDataList: SideBarData[] = [
  { title: 'Explore', icon: ExploreIcon, link: '/dashboard/explore' },
  { title: 'Upload', icon: UploadIcon, link: '/dashboard/upload' },
];
