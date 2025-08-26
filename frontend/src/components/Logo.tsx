import Image from 'next/image';
import logo from '@assets/BRLCADLOGO.png';
import '@styles/Logo.scss';

export const Logo = () => {
  return (
    <div className="logo-container">
      <h1 className="logo-heading">OGV</h1>
      <Image src={logo} alt="logo" className="logo-image" />
    </div>
  );
};
