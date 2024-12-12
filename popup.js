let templateManager;
let currentTemplate;

// 初始化
async function initialize() {
  templateManager = new TemplateManager();
  await loadTemplates();
  
  // 加载选中的文本
  const result = await chrome.storage.local.get('selectedText');
  if (result.selectedText) {
    document.getElementById('quoteText').value = result.selectedText;
  }

  // 设置事件监听器
  setupEventListeners();
  
  // 应用默认模板
  applyTemplate('simple');
}

// 加载模板列表
async function loadTemplates() {
  const templates = templateManager.getAllTemplates();
  const templateSelect = document.getElementById('templateSelect');
  
  // 清空现有选项
  templateSelect.innerHTML = '';
  
  // 添加模板选项
  Object.values(templates).forEach(template => {
    const option = document.createElement('option');
    option.value = template.id;
    option.textContent = template.name;
    templateSelect.appendChild(option);
  });
}

// 应用模板
function applyTemplate(templateId) {
  currentTemplate = templateManager.getTemplate(templateId);
  if (!currentTemplate) return;

  const preview = document.getElementById('cardPreview');
  
  // 应用背景
  if (currentTemplate.background.type === 'color') {
    preview.style.background = currentTemplate.background.value;
  } else if (currentTemplate.background.type === 'gradient') {
    preview.style.background = currentTemplate.background.value;
  }

  // 应用字体样式
  preview.style.fontFamily = currentTemplate.font.family;
  preview.style.fontSize = currentTemplate.font.size;
  preview.style.color = currentTemplate.font.color;
  preview.style.letterSpacing = currentTemplate.font.letterSpacing;
  preview.style.lineHeight = currentTemplate.font.lineHeight;

  // 应用布局
  preview.style.textAlign = currentTemplate.layout.alignment;
  preview.style.padding = currentTemplate.layout.padding;
  preview.style.maxWidth = currentTemplate.layout.maxWidth;

  // 应用特效
  preview.style.boxShadow = currentTemplate.effects.shadow;
  preview.style.border = currentTemplate.effects.border;
  preview.style.borderRadius = currentTemplate.effects.borderRadius;

  updatePreview();
}

// 更新预览
function updatePreview() {
  const text = document.getElementById('quoteText').value;
  const preview = document.getElementById('cardPreview');
  preview.textContent = text;
}

// 设置事件监听器
function setupEventListeners() {
  // 模板选择改变
  document.getElementById('templateSelect').addEventListener('change', (e) => {
    applyTemplate(e.target.value);
  });

  // 文本输入改变
  document.getElementById('quoteText').addEventListener('input', updatePreview);

  // 保存模板按钮
  document.getElementById('saveTemplateBtn').addEventListener('click', async () => {
    const templateName = prompt('请输入模板名称：');
    if (!templateName) return;

    const newTemplate = {
      id: `custom_${Date.now()}`,
      name: templateName,
      ...currentTemplate
    };

    if (await templateManager.saveCustomTemplate(newTemplate)) {
      await loadTemplates();
      alert('模板保存成功！');
    } else {
      alert('模板保存失败！');
    }
  });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initialize); 