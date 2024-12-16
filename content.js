// content.js
// 在页面加载时，自动提取视频链接
const videoElements = document.querySelectorAll('xg-video-container video source');
const videoLinks = [];
videoElements.forEach(source => {
  const videoUrl = source.src;
  if (videoUrl && videoUrl.startsWith('//')) {
    videoLinks.push('https:' + videoUrl);
  }
});
chrome.storage.local.set({ videoLinks: videoLinks });
