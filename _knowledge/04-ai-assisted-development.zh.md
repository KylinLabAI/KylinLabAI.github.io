---
layout: knowledge-article
title: "在不丧失工程所有权的情况下使用 AI 工具"
date: 2026-04-28
category: ai_dev
lang: zh
slug: ai-assisted-development
permalink: /zh/knowledge/ai-assisted-development.html
description: "使用 AI 加速实现的实践护栏，同时保持审查、测试与产品判断的明确性。"
---

使用 AI 加速实现的实践护栏，同时保持审查、测试与产品判断的明确性。

## 所有权问题

AI 编写代码的速度比人类快，但它不能为代码负责。当出现问题时，你仍然要承担责任。挑战在于利用 AI 的速度，而不交出控制权。

## 核心原则

### 1. 你需要审查所有代码

**规则：** 在没有逐行阅读之前，永远不要提交 AI 生成的代码。

```bash
# 不好的工作流
ai generate feature → git add . → git commit -m "Add feature"

# 好的工作流
ai generate feature → 逐行阅读 → 手动测试 → 
必要时重构 → git add . → git commit -m "Add feature"
```

需要警惕的危险信号：
- 对简单问题使用过于复杂的方案
- 安全漏洞（硬编码密钥、SQL注入）
- 未经批准的依赖
- 与代码库不一致的代码模式

### 2. 保持测试覆盖率

AI 除非被明确要求，否则不会编写测试——即使写了，通常也不够深入。

```python
# AI 可能生成的代码
def calculate_discount(price, discount_rate):
    return price * (1 - discount_rate)

# 你应该补充的测试
def test_calculate_discount():
    # 正常情况
    assert calculate_discount(100, 0.1) == 90
    
    # AI 遗漏的边界情况
    assert calculate_discount(100, 0) == 100
    assert calculate_discount(100, 1) == 0
    
    # 无效输入
    with pytest.raises(ValueError):
        calculate_discount(-100, 0.1)
    
    with pytest.raises(ValueError):
        calculate_discount(100, 1.5)
```

**最低测试要求：**
- 所有公共 API 都有测试
- 覆盖边界情况
- 测试错误条件
- 适当模拟集成点

### 3. 架构决策由人来做

AI 在架构决策方面表现糟糕，因为它缺乏以下背景知识：
- 团队的技能和偏好
- 现有的技术债务
- 业务约束和时间线
- 长期维护考量

**必须由人做的决策：**
- 技术栈选择
- 服务边界
- 数据建模方法
- 性能与复杂性的权衡
- 安全架构

**AI 可以帮什么：**
- 实现已确定的方案
- 生成样板代码
- 建议替代实现方案
- 发现现有代码中的bug

### 4. 记录 AI 的角色

对 AI 生成的内容保持透明：

```markdown
## 实现说明

此模块最初使用 Claude 3.5 Sonnet 搭建，提示词如下：
"Create a Python class for handling user authentication with JWT tokens..."

人工修改：
- 添加了速率限制逻辑
- 重构了错误处理以匹配项目标准
- 与现有用户服务集成
- 添加了全面的测试覆盖

审查清单已完成：
☑ 安全审查通过
☑ 性能基准可接受
☑ 代码风格符合项目规范
☑ 所有边界情况已处理
```

这创造了责任追溯，并帮助未来的维护者理解代码的来源。

## 实用工作流

### 第1步：清晰定义问题

```
不好的提示： "构建一个登录系统"

好的提示： """
创建一个 Flask 路由用于用户登录，要求如下：
- 通过 POST 请求接收 email 和 password
- 对照 PostgreSQL 数据库验证凭证
- 返回有效期24小时的 JWT token
- 速率限制：每个IP每分钟5次尝试
- 记录失败尝试用于安全监控
- 遵循 auth/ 目录中现有的项目模式
"""
```

### 第2步：生成和审查

```bash
# 获取初始实现
ai generate --prompt="..." --output=login_route.py

# 审查清单
□ 是否处理了所有边界情况？
□ 是否存在安全问题？
□ 是否符合我们的编码标准？
□ 错误消息是否用户友好？
□ 日志记录是否充分？

# 做出修正
vim login_route.py  # 修复审查中发现的问题
```

### 第3步：彻底测试

```bash
# 运行现有测试套件
pytest tests/auth/ -v

# 为 AI 生成的代码添加新测试
pytest tests/auth/test_login_route.py -v

# 手动测试
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret"}'
```

### 第4步：谨慎集成

```bash
# 检查冲突
git diff main...feature/ai-login

# 确保没有意外更改
git status

# 使用清晰的消息提交
git commit -m "添加登录路由（AI 辅助，人工审查）

- 使用 Claude 3.5 生成初始实现
- 添加了速率限制和安全日志
- 全面的测试覆盖
- 已审查 OWASP 合规性"
```

## 常见陷阱

### ❌ 盲目信任
"一直迭代直到它能用"，却不理解它为什么能用。

**修复：** 在接受代码之前，始终追问"为什么这种方法有效？"

### ❌ 上下文丢失
AI 不了解你的代码库约定，导致风格不一致。

**修复：** 在提示中提供现有代码模式作为示例。

### ❌ 过度工程化
AI 倾向于以超出必要的复杂度解决问题。

**修复：** 明确要求"简单、可读的解决方案"，拒绝不必要的抽象。

### ❌ 安全漏洞
AI 可能引入未经训练防范的漏洞。

**修复：** 对所有 AI 生成的代码运行安全扫描工具（SAST）。

## 有用的工具

### 代码审查助手
- GitHub Copilot Chat: 对生成的代码提问
- CodeRabbit: 带 AI 洞察的自动 PR 审查
- SonarQube: 质量和安全的静态分析

### 测试工具
- pytest-cov: 确保充分的测试覆盖率
- Hypothesis: 基于属性的测试发现边界情况
- 变异测试: 验证测试确实能捕获bug

### 安全扫描器
- Bandit（Python）: 发现常见安全问题
- ESLint security plugins（JavaScript）
- OWASP ZAP: 动态安全测试

## 衡量成功

跟踪这些指标以确保 AI 辅助改善而非降低质量：

| 指标 | 目标 | 为什么重要 |
|--------|--------|----------------|
| AI 代码的 Bug 率 | < 5% 的提交 | 质量控制 |
| AI PR 审查时间 | < 30 分钟 | 审查效率 |
| 测试覆盖率 | > 80% | 安全网 |
| 安全发现 | 0 严重漏洞 | 风险管理 |
| 开发人员满意度 | > 4/5 | 工具采纳度 |

## 结论

AI 是一个强大的工具，但它只是工具——不能替代工程判断力。在 AI 方面成功的团队是那些利用它来增强人类专业能力的团队，而不是替代人类。

保持好奇、保持怀疑、保持掌控。
