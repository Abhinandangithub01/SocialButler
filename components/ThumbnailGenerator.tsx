import React, { useState, useCallback, useRef } from 'react';
import { 
    BaseImage, ThumbnailTheme, THUMBNAIL_THEMES, 
    TextPlacement, TEXT_PLACEMENTS, FontStyle, FONT_STYLES, 
    AspectRatio, ASPECT_RATIOS, ArtStyle, ART_STYLES, 
    LightingStyle, LIGHTING_STYLES, Framing, FRAMING_OPTIONS,
    ImageEffect, IMAGE_EFFECTS
} from '../types';
import { enhanceThumbnailPrompt, generateThumbnailWithPrompt, editThumbnailWithImage } from '../services/geminiService';
import Button from './Button';
import Select from './Select';
import Loader from './Loader';
import Card from './Card';
import { fileToBase64 } from '../utils/fileUtils';

const ThumbnailGenerator: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [theme, setTheme] = useState<ThumbnailTheme>(THUMBNAIL_THEMES[0]);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [textPlacement, setTextPlacement] = useState<TextPlacement>(TEXT_PLACEMENTS[0]);
  const [fontStyle, setFontStyle] = useState<FontStyle>(FONT_STYLES[0]);
  const [textColorStyle, setTextColorStyle] = useState<string>('');
  const [artStyle, setArtStyle] = useState<ArtStyle>(ART_STYLES[0]);
  const [lightingStyle, setLightingStyle] = useState<LightingStyle>(LIGHTING_STYLES[0]);
  const [framing, setFraming] = useState<Framing>(FRAMING_OPTIONS[0]);
  const [colorPalette, setColorPalette] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [imageEffect, setImageEffect] = useState<ImageEffect>(IMAGE_EFFECTS[0]);
  const [baseImage, setBaseImage] = useState<BaseImage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [showPromptEditor, setShowPromptEditor] = useState<boolean>(false);
  const [editablePrompt, setEditablePrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const inputClasses = "w-full bg-base-300/50 border border-base-300 rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-colors duration-300";
  const labelClasses = "block text-sm font-medium text-text-secondary mb-2";

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
      } catch (err) {
        setError('Failed to read image file.');
      }
    }
  };

  const handleGenerate = useCallback(async (promptToUse?: string) => {
    if (!title && !promptToUse) {
      setError('Please provide a title for the thumbnail.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setShowPromptEditor(false);

    try {
      let finalPrompt = promptToUse || enhancedPrompt;
      if (!promptToUse) {
        const newEnhancedPrompt = await enhanceThumbnailPrompt(
            title, theme, !!baseImage, aspectRatio,
            textPlacement, fontStyle, textColorStyle,
            artStyle, lightingStyle, framing, colorPalette, negativePrompt,
            imageEffect
        );
        setEnhancedPrompt(newEnhancedPrompt);
        setEditablePrompt(newEnhancedPrompt);
        finalPrompt = newEnhancedPrompt;
      }
      
      if(!finalPrompt) throw new Error("Prompt could not be generated.");

      let imageResult: string;
      if (baseImage) {
        imageResult = await editThumbnailWithImage(finalPrompt, baseImage.base64, baseImage.mimeType);
      } else {
        imageResult = await generateThumbnailWithPrompt(finalPrompt);
      }
      setGeneratedImage(`data:image/png;base64,${imageResult}`);
    } catch (err: any) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [
      title, theme, baseImage, enhancedPrompt, textPlacement, 
      fontStyle, textColorStyle, aspectRatio, artStyle, 
      lightingStyle, framing, colorPalette, negativePrompt, imageEffect
  ]);
  
  const handleRetry = () => {
    if (enhancedPrompt) {
        handleGenerate(enhancedPrompt);
    }
  };

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'youtube-thumbnail.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-text-primary tracking-tight">YouTube Thumbnail Generator</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <Card title="1. Configure Your Thumbnail">
            <div className="space-y-6">
                <div>
                    <label className={labelClasses}>Thumbnail Title Text</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., My Insane New Setup" className={inputClasses}/>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Select a Theme</label>
                        <Select options={THUMBNAIL_THEMES} value={theme} onChange={(e) => setTheme(e.target.value as ThumbnailTheme)} />
                    </div>
                    <div>
                        <label className={labelClasses}>Art Style</label>
                        <Select options={ART_STYLES} value={artStyle} onChange={(e) => setArtStyle(e.target.value as ArtStyle)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Lighting Style</label>
                        <Select options={LIGHTING_STYLES} value={lightingStyle} onChange={(e) => setLightingStyle(e.target.value as LightingStyle)} />
                    </div>
                    <div>
                        <label className={labelClasses}>Aspect Ratio</label>
                        <Select options={ASPECT_RATIOS} value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} />
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Framing</label>
                        <Select options={FRAMING_OPTIONS} value={framing} onChange={(e) => setFraming(e.target.value as Framing)} />
                    </div>
                    <div>
                        <label className={labelClasses}>Text Placement</label>
                        <Select options={TEXT_PLACEMENTS} value={textPlacement} onChange={(e) => setTextPlacement(e.target.value as TextPlacement)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Font Style</label>
                        <Select options={FONT_STYLES} value={fontStyle} onChange={(e) => setFontStyle(e.target.value as FontStyle)} />
                    </div>
                    <div>
                        <label className={labelClasses}>Text Color / Style</label>
                        <input type="text" value={textColorStyle} onChange={(e) => setTextColorStyle(e.target.value)} placeholder="e.g., bright yellow" className={inputClasses}/>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Color Palette (Optional)</label>
                        <input type="text" value={colorPalette} onChange={(e) => setColorPalette(e.target.value)} placeholder="e.g., pastel pinks and blues" className={inputClasses}/>
                    </div>
                    <div>
                        <label className={labelClasses}>Image Effect</label>
                        <Select options={IMAGE_EFFECTS} value={imageEffect} onChange={(e) => setImageEffect(e.target.value as ImageEffect)} />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Negative Prompt (Optional)</label>
                    <input type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} placeholder="e.g., blurry, watermark, ugly" className={inputClasses}/>
                </div>

                <div>
                    <label className={labelClasses}>Upload a Base Image (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" ref={fileInputRef}/>
                    {baseImage ? (
                        <div className="mt-2 space-y-2">
                            <div className="w-full p-2 border border-base-300 rounded-lg bg-base-100/50">
                                <img src={baseImage.preview} alt="Preview" className="w-full rounded-lg object-contain max-h-64" />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-text-secondary truncate pr-2" title={baseImage.file.name}>{baseImage.file.name}</span>
                                <Button onClick={() => {
                                    setBaseImage(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }} variant="secondary" className="py-1 px-3 text-sm">Remove</Button>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => fileInputRef.current?.click()} 
                            className="w-full text-center mt-2 py-8 border-2 border-dashed border-base-300 rounded-lg hover:border-brand-primary hover:bg-base-200/50 transition-colors flex flex-col items-center justify-center"
                            aria-label="Upload a base image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span className="text-text-secondary font-medium">Click to upload or drag & drop</span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, etc.</span>
                        </button>
                    )}
                </div>
                <Button onClick={() => handleGenerate()} disabled={isLoading} className="w-full !py-3">
                    {isLoading ? <Loader /> : 'Generate Thumbnail'}
                </Button>
            </div>
        </Card>

        <Card title="2. Generated Output" className="sticky top-8">
            <div className="flex items-center justify-center bg-base-100/50 rounded-lg aspect-[16/9] w-full">
                {isLoading && <Loader size="lg" />}
                {error && <p className="text-red-400 text-center p-4">{error}</p>}
                {generatedImage && <img src={generatedImage} alt="Generated thumbnail" className="rounded-lg w-full h-full object-contain" />}
                {!isLoading && !generatedImage && !error && <p className="text-text-secondary">Your thumbnail will appear here</p>}
            </div>
            {generatedImage && !isLoading && (
                <div className="mt-4 flex flex-wrap gap-4">
                    <Button onClick={handleDownload} variant="primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                    </Button>
                    <Button onClick={handleRetry} variant="secondary">Retry with Same Idea</Button>
                    <Button onClick={() => setShowPromptEditor(true)} variant="secondary">Edit Prompt</Button>
                </div>
            )}
        </Card>
      </div>

      {showPromptEditor && enhancedPrompt && (
        <Card title="Edit Generated Prompt">
          <textarea value={editablePrompt} onChange={(e) => setEditablePrompt(e.target.value)} rows={5} className={`${inputClasses} h-auto`} />
          <div className="mt-4">
            <Button onClick={() => handleGenerate(editablePrompt)} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? <Loader /> : 'Generate with Edited Prompt'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ThumbnailGenerator;