// 预设模板配置
const DEFAULT_TEMPLATES = {
  simple: {
    id: 'simple',
    name: '简约',
    background: {
      type: 'color',
      value: '#ffffff'
    },
    font: {
      family: 'Arial',
      size: '24px',
      color: '#000000',
      letterSpacing: '0px',
      lineHeight: '1.5'
    },
    layout: {
      alignment: 'center',
      padding: '40px',
      maxWidth: '80%'
    },
    effects: {
      shadow: 'none',
      border: '1px solid #eee',
      borderRadius: '4px'
    }
  },
  vintage: {
    id: 'vintage',
    name: '复古',
    background: {
      type: 'gradient',
      value: 'linear-gradient(to bottom right, #f3e7d3, #e7d5b7)'
    },
    font: {
      family: 'Times New Roman',
      size: '28px',
      color: '#4a4a4a',
      letterSpacing: '1px',
      lineHeight: '1.8'
    },
    layout: {
      alignment: 'center',
      padding: '50px',
      maxWidth: '75%'
    },
    effects: {
      shadow: '0 4px 8px rgba(0,0,0,0.1)',
      border: '2px solid #d3c4a9',
      borderRadius: '8px'
    }
  },
  modern: {
    id: 'modern',
    name: '现代',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #6e8efb, #a777e3)'
    },
    font: {
      family: 'Arial',
      size: '26px',
      color: '#ffffff',
      letterSpacing: '0.5px',
      lineHeight: '1.6'
    },
    layout: {
      alignment: 'center',
      padding: '45px',
      maxWidth: '85%'
    },
    effects: {
      shadow: '0 8px 16px rgba(0,0,0,0.2)',
      border: 'none',
      borderRadius: '12px'
    }
  }
};

// 模板管理类
class TemplateManager {
  constructor() {
    this.templates = DEFAULT_TEMPLATES;
    this.loadCustomTemplates();
  }

  // 加载自定义模板
  async loadCustomTemplates() {
    try {
      const result = await chrome.storage.local.get('customTemplates');
      if (result.customTemplates) {
        this.templates = { ...this.templates, ...result.customTemplates };
      }
    } catch (error) {
      console.error('加载自定义模板失败:', error);
    }
  }

  // 获取所有模板
  getAllTemplates() {
    return this.templates;
  }

  // 获取指定模板
  getTemplate(templateId) {
    return this.templates[templateId];
  }

  // 保存自定义模板
  async saveCustomTemplate(template) {
    try {
      const result = await chrome.storage.local.get('customTemplates');
      const customTemplates = result.customTemplates || {};
      
      customTemplates[template.id] = template;
      await chrome.storage.local.set({ customTemplates });
      
      this.templates[template.id] = template;
      return true;
    } catch (error) {
      console.error('保存自定义模板失败:', error);
      return false;
    }
  }

  // 删除自定义模板
  async deleteCustomTemplate(templateId) {
    try {
      const result = await chrome.storage.local.get('customTemplates');
      const customTemplates = result.customTemplates || {};
      
      delete customTemplates[templateId];
      await chrome.storage.local.set({ customTemplates });
      
      delete this.templates[templateId];
      return true;
    } catch (error) {
      console.error('删除自定义模板失败:', error);
      return false;
    }
  }

  // 导出模板
  exportTemplate(templateId) {
    const template = this.templates[templateId];
    if (!template) return null;
    
    return JSON.stringify(template);
  }

  // 导入模板
  async importTemplate(templateJson) {
    try {
      const template = JSON.parse(templateJson);
      if (!template.id || !template.name) {
        throw new Error('无效的模板格式');
      }
      
      return await this.saveCustomTemplate(template);
    } catch (error) {
      console.error('导入模板失败:', error);
      return false;
    }
  }
} 