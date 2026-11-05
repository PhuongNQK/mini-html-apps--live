/** Built-in slide dimension presets (CSS px). Can be overridden by "slideSizes" in meta/config.json. */
export const SLIDE_SIZES = [
  {
    group: 'Print',
    sizes: [
      { id: 'a4-landscape', name: 'A4 Landscape', width: 1123, height: 794 },
      { id: 'a4-portrait', name: 'A4 Portrait', width: 794, height: 1123 },
      { id: 'letter-landscape', name: 'US Letter Landscape', width: 1056, height: 816 },
      { id: 'letter-portrait', name: 'US Letter Portrait', width: 816, height: 1056 },
      { id: 'a5-portrait', name: 'A5 Portrait', width: 559, height: 794 },
    ],
  },
  {
    group: 'YouTube',
    sizes: [
      { id: 'yt-thumb', name: 'YouTube Thumbnail', width: 1280, height: 720 },
      { id: 'yt-banner', name: 'YouTube Channel Banner', width: 2560, height: 1440 },
    ],
  },
  {
    group: 'Facebook',
    sizes: [
      { id: 'fb-post', name: 'Facebook Post', width: 1200, height: 630 },
      { id: 'fb-cover', name: 'Facebook Cover', width: 820, height: 312 },
      { id: 'fb-story', name: 'Facebook Story', width: 1080, height: 1920 },
    ],
  },
  {
    group: 'Instagram',
    sizes: [
      { id: 'ig-square', name: 'Instagram Square', width: 1080, height: 1080 },
      { id: 'ig-portrait', name: 'Instagram Portrait', width: 1080, height: 1350 },
      { id: 'ig-story', name: 'Instagram Story / Reel', width: 1080, height: 1920 },
    ],
  },
  {
    group: 'Other',
    sizes: [
      { id: 'tiktok', name: 'TikTok Video', width: 1080, height: 1920 },
      { id: 'x-post', name: 'X (Twitter) Post', width: 1600, height: 900 },
      { id: 'pinterest', name: 'Pinterest Pin', width: 1000, height: 1500 },
      { id: 'wide', name: 'Widescreen 16:9', width: 1920, height: 1080 },
      { id: 'standard', name: 'Standard 4:3', width: 1024, height: 768 },
      { id: 'square', name: 'Square', width: 1000, height: 1000 },
    ],
  },
];
