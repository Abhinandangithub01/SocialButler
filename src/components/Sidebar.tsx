import React from 'react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
  const navItemClasses = (page: Page) =>
    `w-full text-left px-4 py-3 rounded-lg transition-all duration-300 text-lg font-medium flex items-center gap-4 group ${
      currentPage === page
        ? 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'text-text-secondary hover:bg-base-200/60 hover:text-text-primary'
    }`;

    const iconClasses = "w-6 h-6 transition-transform duration-300 group-hover:scale-110";

  return (
    <aside className="w-72 bg-base-200/30 backdrop-blur-lg p-6 border-r border-base-300/50 flex-col hidden lg:flex">
      <div className="text-4xl font-bold text-white mb-12 tracking-wider">
        <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Social</span>
        <span className="text-white">Butler</span>
      </div>
      <nav className="flex flex-col gap-4">
        <button className={navItemClasses(Page.Thumbnail)} onClick={() => setPage(Page.Thumbnail)}>
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          YouTube Thumbnail
        </button>
        <button className={navItemClasses(Page.SocialPost)} onClick={() => setPage(Page.SocialPost)}>
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Social Media Post
        </button>
        <button className={navItemClasses(Page.BackgroundRemoval)} onClick={() => setPage(Page.BackgroundRemoval)}>
          <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          Background Removal
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
