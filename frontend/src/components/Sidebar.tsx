'use client';
import Link from 'next/link';
import React from 'react';
import '@/styles/Sidebar.scss';
import { SideBarDataList } from '@/data/SideBarData';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <>
      <div
        className={`sidebar-large ${isOpen ? 'sidebar-container-open' : 'sidebar-container-closed'}`}
      >
        <div className="sidebar-links">
          {SideBarDataList.map((item, index) => (
            <Link href={item.link} key={index} className="sidebar-link">
              <item.icon />
              <p className="sidebar-link-text">{item.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
