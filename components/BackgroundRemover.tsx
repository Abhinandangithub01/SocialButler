import React, { useState, useCallback, useRef } from 'react';
import { BaseImage } from '../types';
import { removeImageBackground } from '../services/geminiService';
import Button from './Button';
import Loader from './Loader';
import Card from './Card';
import { fileToBase64 } from '../utils/fileUtils';


const BackgroundRemover: React.FC = () => {
  const [baseImage, setBaseImage] = useState<BaseImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setBaseImage({
          file,
          preview: URL.createObjectURL(file),
          base64,
          mimeType: file.type,
        });
        setResultImage(null);
        setError(null);
      } catch (err) {
        setError('Failed to read image file.');
      }
    }
  };

  const handleRemoveBackground = useCallback(async () => {
    if (!baseImage) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const imageResult = await removeImageBackground(baseImage.base64, baseImage.mimeType);
      setResultImage(`data:image/png;base64,${imageResult}`);
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [baseImage]);
  
  const handleDownload = useCallback(() => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [resultImage]);
  
  const checkerboardBg = { 
      background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4y2NgoBAwUqifYGAoFAwkeymFBAwkeymFBAwkeymFBAwkeymFBAwkeymFhQ4A4r/wYg10/pQAAAAASUVORK5CYII=) repeat' 
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-text-primary tracking-tight">Background Remover</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <Card title="1. Upload Image">
            <div className="space-y-6">
                 <div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef}/>
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="w-full text-center py-10 border-2 border-dashed border-base-300 rounded-lg hover:border-brand-primary hover:bg-base-200/50 transition-colors flex flex-col items-center justify-center"
                        aria-label="Upload an image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-text-secondary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-text-secondary font-semibold">
                            {baseImage ? `Selected: ${baseImage.file.name}` : 'Click to upload an image'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG, etc.</span>
                    </button>
                    {baseImage && (
                        <div className="mt-4 p-4 bg-base-100/50 rounded-lg">
                            <h3 className="font-semibold mb-2 text-text-secondary">Original Preview:</h3>
                            <img src={baseImage.preview} alt="Preview" className="rounded-lg max-h-60 mx-auto" />
                        </div>
                    )}
                </div>
                <Button onClick={handleRemoveBackground} disabled={isLoading || !baseImage} className="w-full !py-3">
                    {isLoading ? <Loader /> : 'Remove Background'}
                </Button>
            </div>
        </Card>

        <Card title="2. Result" className="sticky top-8">
            <div className="flex items-center justify-center bg-base-100/50 rounded-lg min-h-[450px] h-full" style={checkerboardBg}>
                {isLoading && <Loader size="lg" />}
                {error && <p className="text-red-400 text-center p-4">{error}</p>}
                {resultImage && <img src={resultImage} alt="Background removed" className="rounded-lg max-w-full max-h-full object-contain" />}
                {!isLoading && !resultImage && !error && <p className="text-text-secondary">Your result will appear here</p>}
            </div>
            {resultImage && !isLoading && (
                <div className="mt-4">
                    <Button onClick={handleDownload} variant="primary" className="w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Image
                    </Button>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};

export default BackgroundRemover;