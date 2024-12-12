class CardExporter {
  constructor() {
    this.dialog = document.getElementById('exportDialog');
    this.loadScript();
  }

  // 动态加载html2canvas
  loadScript() {
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    document.head.appendChild(script);
  }

  // 显示导出对话框
  showExportDialog() {
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
    return {
      format: document.getElementById('exportFormat').value,
      quality: document.getElementById('exportQuality').value / 100,
      width: parseInt(document.getElementById('exportWidth').value),
      height: parseInt(document.getElementById('exportHeight').value)
    };
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
    const settings = this.getExportSettings();
    const preview = document.getElementById('cardPreview');
    const loading = this.showLoading();

    try {
      // 创建canvas
      const canvas = await html2canvas(preview, {
        width: settings.width,
        height: settings.height,
        scale: 2, // 提高清晰度
        useCORS: true,
        backgroundColor: null
      });

      // 转换为blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(
          blob => resolve(blob),
          `image/${settings.format}`,
          settings.quality
        );
      });

      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quote-card-${Date.now()}.${settings.format}`;
      link.click();

      // 清理
      URL.revokeObjectURL(url);
      this.hideExportDialog();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    } finally {
      loading.remove();
    }
  }
} 