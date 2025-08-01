// app.js - 混淆处理后的代码
(function() {
    // 配置参数
    const _0x5a1d = {
        'API_KEY': 'sk-kgojrlfjonnwwdyhusoagmuyagwltrlqkdavhekcnlfcqdyi',
        'API_URL': 'https://api.siliconflow.cn/v1/chat/completions',
        'MODEL': 'deepseek-ai/DeepSeek-V3',
        'MAX_SIZE': 0x500000,
        'ALLOWED_TYPES': ['text/plain']
    };
    
    // 内置分析指令
    const _0x2f7a = `请严格基于用户上传的实际评论内容进行分析，不要使用任何示例数据。请根据以下维度分析评论内容，并按照下面的HTML5格式输出结构化报告并嵌入JavaScript图表：

    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <title>评论分析报告</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"><\/script>
        <style>
            /* 报告内部样式 */
            #analysis-report {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                box-sizing: border-box;
                font-family: 'Segoe UI', system-ui, sans-serif;
            }
            
            #analysis-report section, 
            #analysis-report #problem-pyramid, 
            #analysis-report .contradiction {
                width: 90%;
                margin: 15px auto;
            }
            
            #analysis-report canvas {
                max-width: 100%;
                height: auto !important;
            }
            
            #analysis-report .motivation-cloud {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 8px;
            }
            
            #analysis-report .motive-tag {
                display: inline-block;
                margin: 5px;
                padding: 5px 10px;
                background: #e3f2fd;
                border-radius: 15px;
            }
            
            #analysis-report .dual-frequency {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 25px;
                margin: 30px 0;
            }
            
            #analysis-report .frequency-container {
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }
            
            #analysis-report .term {
                display: flex;
                justify-content: space-between;
                margin: 8px 0;
                padding: 6px 12px;
                background: #f8f9fa;
                border-radius: 4px;
            }
            
            #analysis-report .count {
                color: #666;
                font-family: monospace;
            }
            
            #analysis-report #problem-pyramid .layer {
                transition: width 0.3s;
                padding: 15px; 
                margin: 10px; 
                border-left: 4px solid #007bff;
                background: #f1f8ff;
            }
            
            #analysis-report #problem-pyramid .surface-complaints { width: 95% }
            #analysis-report #problem-pyramid .core-painpoints { width: 85% }
            #analysis-report #problem-pyramid .root-cause { width: 75% }
            
            #analysis-report .contradiction { 
                background: #fff3cd; 
                padding: 15px; 
                border-radius: 4px; 
            }
            
            @media (max-width: 768px) {
                #analysis-report .dual-frequency {
                    grid-template-columns: 1fr;
                    gap: 15px;
                }
                
                #analysis-report .term {
                    font-size: 14px;
                }
                
                #analysis-report { width: 95%; }
                #analysis-report #problem-pyramid .layer { width: 100%; }
            }
        <\/style>
    <\/head>
    <body>
        <div id="analysis-report">
            <!-- 多维分析区块 -->
            <section>
                <h2>满意度分析</h2>
                <canvas id="sentimentChart" style="height:200px"></canvas>
                <script>
                new Chart(document.getElementById('sentimentChart'), {
                    type: 'doughnut',
                    data: { 
                        labels: ['积极', '消极'], 
                        datasets: [{ 
                            data: [AI_积极比例, AI_消极比例],
                            backgroundColor: ['#4169E1', '#F44336']
                        }] 
                    }
                });
                <\/script>
            </section>

            <div class="dual-frequency">
                <section>
                    <h2>好评特征词频</h2>
                    <div id="positive-frequency" class="frequency-container">
                        <script>
                        (function() {
                            const total = AI_好评词.reduce((sum, word) => sum + word.weight, 0);
                            AI_好评词
                                .sort((a,b) => b.weight - a.weight)
                                .forEach(word => {
                                    const percentage = ((word.weight / total) * 100).toFixed(2) + '%';
                                    document.write(\`
                                        <div class="term">
                                            <span>\${word.text}</span>
                                            <span class="count">\${percentage}</span>
                                        </div>
                                    \`);
                                });
                        })();
                        <\/script>
                    </div>
                </section>
            
                <section>
                    <h2>差评特征词频</h2>
                    <div id="negative-frequency" class="frequency-container">
                        <script>
                        (function() {
                            const total = AI_差评词.reduce((sum, word) => sum + word.weight, 0);
                            AI_差评词
                                .sort((a,b) => b.weight - a.weight)
                                .forEach(word => {
                                    const percentage = ((word.weight / total) * 100).toFixed(2) + '%';
                                    document.write(\`
                                        <div class="term">
                                            <span>\${word.text}</span>
                                            <span class="count">\${percentage}</span>
                                        </div>
                                    \`);
                                });
                        })();
                        <\/script>
                    </div>
                </section>
            </div>

            <!-- 新增购买动机 -->
            <section>
                <h2>购买动机</h2>
                <div class="motivation-cloud">
                    <script>
                    AI_购买动机.forEach(motive => document.write(\`
                        <span class="motive-tag" style="font-size:\${motive.weight*0.8+12}px">
                            \${motive.text}
                        </span>\`));
                    <\/script>
                </div>
            </section>

            <!-- 新增使用场景 -->
            <section>
                <h2>使用场景</h2>
                <div class="dual-frequency">
                    <div class="frequency-container">
                        <h3>高频场景</h3>
                        <script>
                        AI_使用场景.slice(0,5).forEach(scene => document.write(\`
                            <div class="term">
                                <span>\${scene.text}</span>
                                <span class="count">\${scene.count}次</span>
                            </div>\`));
                        <\/script>
                    </div>
                    <div class="frequency-container">
                        <h3>特殊场景</h3>
                        <script>
                        AI_特殊场景.slice(0,3).forEach(scene => document.write(\`
                            <div class="term">
                                <span>\${scene.text}</span>
                                <span class="count">\${scene.ratio}%</span>
                            </div>\`));
                        <\/script>
                    </div>
                </div>
            </section>

            <!-- 问题金字塔分析 -->
            <div id="problem-pyramid">
                <div class="layer surface-complaints">表面问题: AI_提取抱怨标签</div>
                <div class="layer core-painpoints">核心痛点: AI_聚类根因分析</div>
                <div class="layer root-cause">根本原因: AI_推导产品缺陷</div>
            </div>

            <!-- 时间序列分析 -->
            <h2>问题趋势分析</h2>
            <canvas id="timelineChart" height="250"></canvas>
            <script>
            new Chart(document.getElementById('timelineChart'), {
                type: 'line',
                data: {
                    labels: AI_时间节点数组,
                    datasets: [{
                        label: '问题集中度',
                        data: AI_问题频率,
                        borderColor: 'rgb(255, 99, 132)'
                    }]
                }
            });
            <\/script>
        </div>
    </body>
    </html>

    分析策略要求：
    1. 严格基于用户上传的实际评论内容进行分析，不要使用任何示例数据
    2. 实施语义清洗：情感校准→场景标记
    3. 对矛盾评价采用加权决策树处理（如"太重但耐用"标记为[功能权重>外观权重]）
    4. 输出改进方案时按[技术可行性:成本消耗:体验提升]三维评分矩阵排序
    
    重要提示：请直接输出完整的HTML代码，不要添加任何额外的说明文字。`;

    let _0x3e7c = [];
    let _0x1a4f = null;
    
    // 初始化事件监听器
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('generate-btn').addEventListener('click', _0x4b2a);
        document.getElementById('download-btn').addEventListener('click', _0x2c7e);
        document.getElementById('view-btn').addEventListener('click', _0x3f9d);
        document.getElementById('file-input').addEventListener('change', _0x1d8f);
    });

    // 文件上传处理
    async function _0x1d8f() {
        const _0x4e6b = document.getElementById('file-input');
        const _0x5d27 = Array.from(_0x4e6b.files);
        const _0x4a0e = document.getElementById('file-list');
        const _0x1e3a = document.getElementById('generate-btn');

        try {
            _0x4a0e.innerHTML = '';
            _0x3e7c = [];
            
            for (const _0x2d8e of _0x5d27) {
                if (_0x2d8e.size > _0x5a1d.MAX_SIZE) {
                    throw new Error(`文件 ${_0x2d8e.name} 超过大小限制 (最大 ${_0x5a1d.MAX_SIZE/1024/1024}MB)`);
                }
                if (!_0x5a1d.ALLOWED_TYPES.includes(_0x2d8e.type)) {
                    throw new Error(`不支持的文件类型: ${_0x2d8e.type}，请上传TXT文本文件`);
                }

                const _0x3c9f = await _0x3b1f(_0x2d8e);
                
                _0x3e7c.push({
                    name: _0x2d8e.name,
                    type: _0x2d8e.type,
                    size: _0x2d8e.size,
                    content: _0x3c9f,
                    uploadedAt: new Date().toISOString()
                });

                const _0x4c7a = document.createElement('li');
                _0x4c7a.className = 'file-item';
                _0x4c7a.innerHTML = `
                    <span>${_0x2d8e.name} (${_0x10c0(_0x2d8e.size)})</span>
                    <button class="remove-btn" data-filename="${_0x2d8e.name}">×</button>
                `;
                _0x4a0e.appendChild(_0x4c7a);
            }
            
            if (_0x3e7c.length > 0) {
                _0x1e3a.disabled = false;
            }
            
            document.querySelectorAll('.remove-btn').forEach(_0x3d4c => {
                _0x3d4c.addEventListener('click', function() {
                    const _0x5b5d = this.dataset.filename;
                    _0x3a1b(_0x5b5d);
                    if (_0x3e7c.length === 0) {
                        _0x1e3a.disabled = true;
                    }
                });
            });
        } catch (_0x2a3e) {
            _0x3f28(_0x2a3e.message);
        }
    }

    // 文件内容读取
    function _0x3b1f(_0x5e6d) {
        return new Promise((_0x5a7e, _0x2f0e) => {
            const _0x5c8b = new FileReader();
            _0x5c8b.onload = () => _0x5a7e(_0x5c8b.result);
            _0x5c8b.onerror = _0x2f0e;
            _0x5c8b.readAsText(_0x5e6d, 'UTF-8');
        });
    }

    // 生成报告
    async function _0x4b2a() {
        const _0x5d2f = document.getElementById('loading');
        const _0x1d6c = document.getElementById('error-message');
        const _0x2e0a = document.getElementById('generate-btn');
        const _0x5c0f = document.getElementById('result-area');
        const _0x3f1d = document.getElementById('report-viewer');
        
        _0x3f1d.style.display = 'none';
        
        if (_0x3e7c.length === 0) {
            _0x3f28('请先上传评论文件');
            return;
        }

        try {
            _0x5d2f.style.display = 'block';
            _0x1d6c.style.display = 'none';
            _0x5c0f.style.display = 'none';
            _0x2e0a.disabled = true;
            
            let _0x1b0a = "";
            for (const _0x1a92 of _0x3e7c) {
                _0x1b0a += `\n\n文件【${_0x1a92.name}】内容：\n${_0x1a92.content}`;
            }
            
            const _0x5a3f = _0x2f7a + _0x1b0a;

            const _0x3f6c = [{
                role: "user",
                content: _0x5a3f
            }];

            const _0x5a9a = await fetch(_0x5a1d.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${_0x5a1d.API_KEY}`,
                    'X-SiliconFlow-Client': 'web-app/1.0'
                },
                body: JSON.stringify({
                    model: _0x5a1d.MODEL,
                    messages: _0x3f6c,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!_0x5a9a.ok) {
                const _0x4d2f = await _0x5a9a.json();
                throw new Error(_0x4d2f.error?.message || `API请求失败: ${_0x5a9a.status}`);
            }
            
            const _0x5c0a = await _0x5a9a.json();
            _0x1a4f = _0x5c0a.choices[0].message.content;
            
            _0x1a4f = _0x1c3c(_0x1a4f);
            
            document.getElementById('success-message').textContent = '报告生成成功！';
            _0x5c0f.style.display = 'block';
            
            _0x5d2f.style.display = 'none';
            _0x2e0a.disabled = false;
            
            _0x5c0f.scrollIntoView({ behavior: 'smooth' });
            
        } catch (_0x4c0d) {
            _0x3f28(_0x4c0d.message);
            console.error('报告生成错误:', _0x4c0d);
            _0x5d2f.style.display = 'none';
            _0x2e0a.disabled = false;
        }
    }
    
    // 清理报告内容
    function _0x1c3c(_0x3d87) {
        const _0x2c1a = _0x3d87.indexOf('<!DOCTYPE html>');
        if (_0x2c1a !== -1) return _0x3d87.substring(_0x2c1a);
        
        const _0x1e7b = _0x3d87.indexOf('<html');
        if (_0x1e7b !== -1) return _0x3d87.substring(_0x1e7b);
        
        return _0x3d87;
    }

    // 下载报告
    function _0x2c7e() {
        if (!_0x1a4f) {
            _0x3f28('请先生成报告');
            return;
        }
        
        try {
            const _0x5e3d = new Blob([_0x1a4f], { type: 'text/html' });
            const _0x4e1f = URL.createObjectURL(_0x5e3d);
            const _0x5b7b = document.createElement('a');
            _0x5b7b.href = _0x4e1f;
            _0x5b7b.download = '评论分析报告_' + new Date().toISOString().slice(0, 10) + '.html';
            document.body.appendChild(_0x5b7b);
            _0x5b7b.click();
            
            setTimeout(() => {
                document.body.removeChild(_0x5b7b);
                URL.revokeObjectURL(_0x4e1f);
            }, 100);
        } catch (_0x5a1f) {
            _0x3f28('下载失败: ' + _0x5a1f.message);
        }
    }

    // 在当前页面显示报告
    function _0x3f9d() {
        if (!_0x1a4f) {
            _0x3f28('请先生成报告');
            return;
        }
        
        try {
            const _0x1f92 = document.getElementById('report-viewer');
            const _0x1a5c = document.getElementById('report-frame');
            
            const _0x3d4f = new Blob([_0x1a4f], { type: 'text/html' });
            const _0x3e5f = URL.createObjectURL(_0x3d4f);
            
            _0x1a5c.src = _0x3e5f;
            _0x1f92.style.display = 'block';
            
            _0x1f92.scrollIntoView({ behavior: 'smooth' });
            
            _0x1a5c.onload = function() {
                URL.revokeObjectURL(_0x3e5f);
            };
        } catch (_0x1b5a) {
            _0x3f28('显示报告失败: ' + _0x1b5a.message);
        }
    }

    // 辅助函数
    function _0x10c0(_0x4a8b) {
        if (_0x4a8b < 1024) return _0x4a8b + ' B';
        if (_0x4a8b < 1048576) return (_0x4a8b/1024).toFixed(1) + ' KB';
        return (_0x4a8b/1048576).toFixed(1) + ' MB';
    }

    function _0x3a1b(_0x1f3c) {
        _0x3e7c = _0x3e7c.filter(_0x2b9d => _0x2b9d.name !== _0x1f3c);
        document.querySelectorAll('.file-item').forEach(_0x1d4e => {
            if (_0x1d4e.textContent.includes(_0x1f3c)) _0x1d4e.remove();
        });
    }

    function _0x3f28(_0x4c5b) {
        const _0x1d28 = document.getElementById('error-message');
        _0x1d28.textContent = _0x4c5b;
        _0x1d28.style.display = 'block';
        
        setTimeout(() => {
            _0x1d28.style.display = 'none';
        }, 5000);
    }
})();
