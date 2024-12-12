// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'create-quote-card',
    title: '生成金句卡片',
    contexts: ['selection']
  });
});

// 处理右键菜单点击
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'create-quote-card') {
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 800,
      height: 600
    });
  }
});

// 处理来自content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TEXT_SELECTED') {
    // 存储选中的文本，以便popup使用
    chrome.storage.local.set({ selectedText: message.text });
  }
}); 