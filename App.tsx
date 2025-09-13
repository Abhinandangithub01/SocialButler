import React, { useState, useCallback } from 'react';
import { Page } from './types';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import ThumbnailGenerator from './components/ThumbnailGenerator';
import SocialPostGenerator from './components/SocialPostGenerator';
import BackgroundRemover from './components/BackgroundRemover';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Thumbnail);

  const handleSetPage = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case Page.Thumbnail:
        return <ThumbnailGenerator />;
      case Page.SocialPost:
        return <SocialPostGenerator />;
      case Page.BackgroundRemoval:
        return <BackgroundRemover />;
      default:
        return <ThumbnailGenerator />;
    }
  };

  return (
    <Layout>
      <Sidebar currentPage={currentPage} setPage={handleSetPage} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl">
         {renderCurrentPage()}
        </div>
      </main>
    </Layout>
  );
};

export default App;