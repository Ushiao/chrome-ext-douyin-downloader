// 获取按钮和链接容器
const parseButton = document.getElementById('parseButton');
const videoLinkContainer = document.getElementById('videoLinkContainer');
const videoLinksList = document.getElementById('videoLinksList'); // New container for multiple links

// 点击按钮时解析当前网页
parseButton.addEventListener('click', function() {
    // 启动解析过程
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0];
        console.log(tab.url);
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: parseVideoLink
        }, function(results) {
            if (results && results[0] && results[0].result) {
                const videoInfo = results[0].result;
                if (videoInfo && videoInfo.length > 0) {
                    // Clear previous results
                    videoLinkContainer.innerHTML = '<p>视频链接：</p>';
                    
                    // Loop through each video and create a link with info
                    videoInfo.forEach(video => {
                        const linkElement = document.createElement('a');
                        linkElement.href = video.url;
                        linkElement.target = '_blank';
                        linkElement.textContent = `点击下载视频 (${video.info})`;
                        
                        const linkWrapper = document.createElement('div');
                        linkWrapper.appendChild(linkElement);
                        videoLinkContainer.appendChild(linkWrapper);
                    });

                    videoLinkContainer.style.display = 'block';
                } else {
                    alert('未能找到视频链接');
                }
            } else {
                alert('解析失败');
            }
        });
    });
});


// 解析视频链接的函数
function parseVideoLink() {
    const videoSources = document.querySelectorAll('xg-video-container video source');
    const videoInfo = [];
    
    videoSources.forEach((source, index) => {
        // Skip the second video source (index 1)
        if (source.src && index !== 1) {
            // You can add more conditions here to check the URL or any other property
            const videoData = {
                url: source.src,
                info: source.src.includes('1080p') ? 'HD' : 'SD'  // Example condition based on URL
            };
            videoInfo.push(videoData);
        }
    });

    return videoInfo.length > 0 ? videoInfo : null;
}

