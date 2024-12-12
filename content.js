// 监听文本选择事件
document.addEventListener('mouseup', function(event) {
  const selectedText = window.getSelection().toString().trim();
  
  if (selectedText) {
    // 向服务工作进程发送选中的文本
    chrome.runtime.sendMessage({
      type: 'TEXT_SELECTED',
      text: selectedText,
      position: {
        x: event.pageX,
        y: event.pageY
      }
    });
  }
});

// 监听来自扩展的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTED_TEXT') {
    sendResponse({ text: window.getSelection().toString().trim() });
  }
}); 