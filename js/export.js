class CardExporter {
  constructor() {
    this.dialog = document.getElementById('exportDialog');
    this.initialized = false;
    this.initialize();
  }

  // 初始化
  async initialize() {
    try {
      // 确保 html2canvas 已加载
      if (typeof html2canvas === 'undefined') {
        // 等待一段时间再次检查
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (typeof html2canvas === 'undefined') {
          throw new Error('html2canvas not loaded');
        }
      }
      this.initialized = true;
    } catch (error) {
      console.error('CardExporter initialization failed:', error);
      this.initialized = false;
      throw error; // 向上传播错误
    }
  }

  // 显示导出对话框
  showExportDialog() {
    if (!this.initialized) {
      alert('导出功能初始化失败，请刷新页面重试');
      return;
    }
    
    this.dialog.style.display = 'flex';
    
    // 设置默认尺寸
    const preview = document.getElementById('cardPreview');
    document.getElementById('exportWidth').value = preview.offsetWidth;
    document.getElementById('exportHeight').value = preview.offsetHeight;
  }

  // 隐藏导出对话框
  hideExportDialog() {
    this.dialog.style.display = 'none';
  }

  // 获取导出设置
  getExportSettings() {
    const settings = {
      format: document.getElementById('exportFormat').value,
      quality: document.getElementById('exportQuality').value / 100,
      width: parseInt(document.getElementById('exportWidth').value),
      height: parseInt(document.getElementById('exportHeight').value)
    };

    // 验证设置
    if (!settings.width || !settings.height) {
      throw new Error('请输入有效的图片尺寸');
    }
    if (settings.quality <= 0 || settings.quality > 1) {
      throw new Error('请输入有效的图片质量(1-100)');
    }

    return settings;
  }

  // 创建loading遮罩
  showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    document.body.appendChild(loading);
    return loading;
  }

  // 导出卡片为图片
  async exportCard() {
    if (!this.initialized) {
      alert('导出功能初始化失败，请刷新页面重试');
      return;
    }

    let loading = null;
    
    try {
      const settings = this.getExportSettings();
      const preview = document.getElementById('cardPreview');
      
      // 显示加载状态
      loading = this.showLoading();

      // 克隆预览元素以保持原始样式
      const clonedPreview = preview.cloneNode(true);
      clonedPreview.style.width = `${settings.width}px`;
      clonedPreview.style.height = `${settings.height}px`;
      clonedPreview.style.position = 'fixed';
      clonedPreview.style.left = '-9999px';
      document.body.appendChild(clonedPreview);

      // 创建canvas
      const canvas = await html2canvas(clonedPreview, {
        width: settings.width,
        height: settings.height,
        scale: 2, // 提高清晰度
        useCORS: true,
        backgroundColor: null,
        logging: false // 禁用日志
      });

      // 移除克隆的元素
      document.body.removeChild(clonedPreview);

      // 转换为blob
      const blob = await new Promise((resolve, reject) => {
        try {
          canvas.toBlob(
            blob => resolve(blob),
            `image/${settings.format}`,
            settings.quality
          );
        } catch (error) {
          reject(error);
        }
      });

      if (!blob) {
        throw new Error('图片生成失败');
      }

      // 使用 chrome.downloads API 下载文件
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: `quote-card-${Date.now()}.${settings.format}`,
        saveAs: true
      }, (downloadId) => {
        URL.revokeObjectURL(url);
        if (chrome.runtime.lastError) {
          throw new Error(chrome.runtime.lastError.message);
        }
      });

      this.hideExportDialog();
    } catch (error) {
      console.error('导出失败:', error);
      alert(error.message || '导出失败，请重试');
    } finally {
      if (loading) {
        loading.remove();
      }
    }
  }
} 