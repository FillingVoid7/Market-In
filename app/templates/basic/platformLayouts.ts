export interface PlatformLayout {
  imageAspectRatio: string;
  maxSize: string;
  preferredCTA: string;
  layoutStyle: 'rich-preview' | 'minimal' | 'video-centered';
  maxCaptionLength: number;
  allowVideo: boolean;
  allowMultipleImages: boolean;
  defaultStyle: {
    fontFamily: string;
    fontSize: string;
    textColor: string;
    backgroundColor: string;
    accentColor: string;
    borderRadius: string;
  };
}

export const platformLayouts: Record<string, PlatformLayout> = {
  Facebook: {
    imageAspectRatio: '1:1',
    maxSize: '1200x1200',
    preferredCTA: 'Shop Now',
    layoutStyle: 'rich-preview',
    maxCaptionLength: 2200,
    allowVideo: true,
    allowMultipleImages: true,
    defaultStyle: {
      fontFamily: 'Arial',
      fontSize: '14px',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
      accentColor: '#1877F2',
      borderRadius: '8px'
    }
  },
  Instagram: {
    imageAspectRatio: '4:5',
    maxSize: '1080x1350',
    preferredCTA: 'Explore',
    layoutStyle: 'minimal',
    maxCaptionLength: 2200,
    allowVideo: true,
    allowMultipleImages: true,
    defaultStyle: {
      fontFamily: 'Arial',
      fontSize: '14px',
      textColor: '#000000',
      backgroundColor: '#FFFFFF',
      accentColor: '#E1306C',
      borderRadius: '4px'
    }
  },
  TikTok: {
    imageAspectRatio: '9:16',
    maxSize: '1080x1920',
    preferredCTA: 'Watch Now',
    layoutStyle: 'video-centered',
    maxCaptionLength: 100,
    allowVideo: true,
    allowMultipleImages: false,
    defaultStyle: {
      fontFamily: 'Arial',
      fontSize: '16px',
      textColor: '#FFFFFF',
      backgroundColor: '#000000',
      accentColor: '#FE2C55',
      borderRadius: '0px'
    }
  }
};

export const getPlatformLayout = (platform: string): PlatformLayout => {
  return platformLayouts[platform] || platformLayouts.Facebook;
}; 