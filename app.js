// 配置参数修改为硅基流动API
const CONFIG = {
    API_KEY: 'sk-kgojrlfjonnwwdyhusoagmuyagwltrlqkdavhekcnlfcqdyi',
    API_URL: 'https://api.siliconflow.cn/v1/chat/completions',  // 硅基API地址
    MODEL: 'deepseek-ai/DeepSeek-V3',  // 硅基指定模型名称
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 调整为5MB
    ALLOWED_TYPES: ['text/plain', 'application/pdf']
}

let uploadedFiles = [];

// 文件上传处理
async function handleFileUpload() {
    const fileInput = document.getElementById('file-input');
    const files = Array.from(fileInput.files);
    const fileList = document.getElementById('file-list');

    try {
        for (const file of files) {
            // 验证文件
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                throw new Error(`文件 ${file.name} 超过大小限制 (最大 ${CONFIG.MAX_FILE_SIZE/1024/1024}MB)`);
            }
            if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
                throw new Error(`不支持的文件类型: ${file.type}`);
            }

            // 读取文件内容
            const content = await readFileContent(file);
            
            // 存储文件信息
            uploadedFiles.push({
                name: file.name,
                type: file.type,
                size: file.size,
                content: content,
                uploadedAt: new Date().toISOString()
            });

            // 更新文件列表
            const li = document.createElement('li');
            li.className = 'file-item';
            li.innerHTML = `
                <span>${file.name} (${formatFileSize(file.size)})</span>
                <button onclick="removeFile('${file.name}')">删除</button>
            `;
            fileList.appendChild(li);
        }
        fileInput.value = ''; // 清空选择
    } catch (error) {
        showError(error.message);
    }
}

// 文件内容读取
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        if (file.type === 'application/pdf') {
            reject(new Error('暂不支持PDF文件解析'));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file, 'UTF-8');
    });
}

const QUESTION_PATH = 'https://github.com/xiafancat/rvu/blob/main/questions.txt'; 

// 更新为GitHub上的完整URL
async function loadQuestion() {
    try {
        const response = await fetch(QUESTION_PATH);
        
        // 增强状态码检查
        if (response.status === 404) {
            throw new Error('问题文件不存在');
        }
        if (!response.ok) {
            throw new Error(`服务器错误: ${response.status}`);
        }

        // 放宽内容类型检查
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/plain')) {
            console.warn('非标准文本类型:', contentType);
        }

        const questionText = await response.text();
        if (!questionText.trim()) {
            throw new Error('问题文件内容为空');
        }
        
        return { question: questionText.trim() };
    } catch (error) {
        console.error('问题加载失败:', error);
        return { 
            question: "请分析并总结上传的文件内容",
            _isFallback: true
        };
    }
}

// 修改后的askQuestion函数
async function askQuestion() {
    const loading = document.getElementById('loading');
    const responseDiv = document.getElementById('response');

    try {
        // 重置状态
        loading.style.display = 'block';
        responseDiv.textContent = '';

        // 前置验证
        if (uploadedFiles.length === 0) {
            throw new Error('请先上传分析文件');
        }

        // 加载问题
        const { question } = await loadQuestion();
        console.log('当前使用问题:', question); // 调试日志

        // 构建有效内容
        const validContents = uploadedFiles
            .filter(f => f.type === 'text/plain')
            .map(f => `【${f.name}】\n${f.content}`);

        if (validContents.length === 0) {
            throw new Error('没有可分析的文本内容');
        }

        // API请求
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: [{
                    role: "user",
                    content: `${validContents.join('\n\n')}\n\n${question}`
                }],
                temperature: 0.7
            })
        });

        // 错误处理增强
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        responseDiv.textContent = data.choices[0].message.content;
    } catch (error) {
        showError(error.message);
        console.error('API请求错误:', error);
    } finally {
        loading.style.display = 'none';
    }
}

// 辅助函数
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1048576).toFixed(1) + ' MB';
}

function removeFile(filename) {
    uploadedFiles = uploadedFiles.filter(f => f.name !== filename);
    document.querySelectorAll('.file-item').forEach(li => {
        if (li.textContent.includes(filename)) li.remove();
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function copyToClipboard() {
    const responseText = document.getElementById('response').textContent;
    if (!responseText) {
        showError("没有可复制的内容");
        return;
    }
    
    navigator.clipboard.writeText(responseText)
        .then(() => showToast('内容已复制到剪贴板'))
        .catch(err => showError('复制失败: ' + err.message));
}

// 修正后的提示功能
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        animation: fadeInOut 2s;
        z-index: 1000;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// 绑定文件选择事件
document.getElementById('file-input').addEventListener('change', handleFileUpload);
