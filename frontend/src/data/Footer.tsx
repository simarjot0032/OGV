import {
  FacebookIcon,
  GithubIcon,
  LinkedInIcon,
  XIcon,
  YoutubeIcon,
} from '@icons';

interface FooterDataItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export const FooterData: FooterDataItem[] = [
  {
    icon: <FacebookIcon />,
    label: 'Facebook',
    href: 'https://www.facebook.com/pages/BRL-CAD/387112738872',
  },
  {
    icon: <GithubIcon />,
    label: 'Github',
    href: 'https://github.com/BRL-CAD/',
  },
  {
    icon: <LinkedInIcon />,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/brlcad',
  },
  {
    icon: <XIcon />,
    label: 'Twitter',
    href: 'https://twitter.com/brl_cad',
  },
  {
    icon: <YoutubeIcon />,
    label: 'Youtube',
    href: 'https://www.youtube.com/results?search_query=brl+-+cad',
  },
];
