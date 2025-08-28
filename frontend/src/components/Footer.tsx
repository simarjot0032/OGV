'use client';
import { Logo, Paragraph } from '@components';
import '@styles/Footer.scss';
import Link from 'next/link';
import { LinksHomeData } from '@/data/LinksHomeData';
import { FooterData } from '@/data/Footer';

export default function Footer() {
  return (
    <>
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <Logo />
          </div>
          <div className="footer-links">
            {LinksHomeData.map((item) => (
              <Link href={item.href} key={item.label} className="footer-link">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-right">
          {FooterData.map((social) => (
            <Link
              href={social.href}
              key={social.label}
              title={social.label}
              className="footer-social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-copyright">
        <Paragraph paragraph="Copyright © 2025 BRL-CAD. All rights reserved." />
      </div>
    </>
  );
}
