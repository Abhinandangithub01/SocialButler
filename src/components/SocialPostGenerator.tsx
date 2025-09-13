import React, { useState, useCallback } from 'react';
import { SocialPlatform, PostType, SOCIAL_PLATFORMS, POST_TYPES } from '../types';
import { generateSocialPost, generateImageForSocialPost } from '../services/geminiService';
import Button from './Button';
import Select from './Select';
import Loader from './Loader';
import Tabs from './Tabs';
import Card from './Card';

const SocialPostGenerator: React.FC = () => {
  const [platform, setPlatform] = useState<SocialPlatform>('LinkedIn');
  const [postType, setPostType] = useState<PostType>(POST_TYPES[0]);
  const [idea, setIdea] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const labelClasses = "block text-sm font-medium text-text-secondary mb-2";

  const handleGenerate = useCallback(async () => {
    if (!idea) {
      setError('Please provide the main idea for your post.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);
    setGeneratedImage(null);

    try {
      const { postText, imagePrompt } = await generateSocialPost(platform, postType, idea);
      setGeneratedPost(postText);

      if (imagePrompt) {
        const imageResult = await generateImageForSocialPost(imagePrompt);
        setGeneratedImage(`data:image/png;base64,${imageResult}`);
      }
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [platform, postType, idea]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'social-post-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-text-primary tracking-tight">Social Media Post Generator</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <Card title="1. Configure Your Post">
          <div className="space-y-6">
            <div>
              <label className={labelClasses}>Platform</label>
              <div className="flex gap-2 p-1 bg-base-300/60 rounded-lg">
                {SOCIAL_PLATFORMS.map(p => (
                  <button key={p} onClick={() => setPlatform(p)} className={`flex-1 py-2 rounded-md transition-all duration-300 font-semibold ${platform === p ? 'bg-brand-primary text-white shadow' : 'bg-transparent text-text-secondary hover:bg-base-200/50'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClasses}>Select Post Type</label>
              <Select options={POST_TYPES} value={postType} onChange={e => setPostType(e.target.value as PostType)} />
            </div>
            <div>
              <label className={labelClasses}>What is the main idea of your post?</label>
              <textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g., Announcing our new product launch next week..." rows={5} className="w-full bg-base-300/50 border border-base-300 rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-colors duration-300" />
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full !py-3">
              {isLoading ? <Loader /> : 'Generate Post'}
            </Button>
          </div>
        </Card>

        <Card title="2. Generated Output" className="sticky top-8">
            <div className="min-h-[450px] h-full flex flex-col">
            {isLoading && <div className="flex-1 flex items-center justify-center"><Loader size="lg" /></div>}
            {error && <p className="text-red-400 text-center p-4">{error}</p>}
            {!isLoading && !error && (generatedPost || generatedImage) && (
              <Tabs
                tabs={[
                  { label: 'Post Text', content: <div className="prose prose-invert max-w-none bg-base-100/50 p-4 rounded-b-lg whitespace-pre-wrap text-text-primary">{generatedPost}</div> },
                  { 
                    label: 'Suggested Image', 
                    content: generatedImage ? (
                      <div className="bg-base-100/50 p-4 rounded-b-lg space-y-4">
                        <div className="aspect-square w-full rounded-lg overflow-hidden">
                          <img src={generatedImage} alt="Suggested for post" className="w-full h-full object-cover"/>
                        </div>
                        <Button onClick={handleDownload} className="w-full">
                           <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                           </svg>
                          Download Image
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-base-100/50 rounded-b-lg text-text-secondary flex items-center justify-center min-h-[200px]">No image was generated.</div>
                    )
                  },
                ]}
              />
            )}
            {!isLoading && !generatedPost && !error && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-text-secondary">Your post will appear here</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SocialPostGenerator;
