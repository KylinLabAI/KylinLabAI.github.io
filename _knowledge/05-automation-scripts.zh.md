---
layout: knowledge-article
title: "消除重复交付摩擦的小型自动化"
date: 2026-04-28
category: testing_automation
lang: zh
slug: automation-scripts
permalink: /zh/knowledge/automation-scripts.html
description: "简单的脚本、检查与模板可以在不需要完整内部平台前删除重复手工工作。"
---

简单的脚本、检查和模板可以在不需要完整内部平台之前，消除重复的人工工作。

## 自动化的最佳切入点

大多数团队等待自动化太久。他们认为需要复杂的 CI/CD 管道，但简单的脚本能用5%的努力解决80%的问题。

## 识别自动化候选任务

寻找以下特征的任务：
- ✅ 每周执行超过一次
- ✅ 遵循可预测的步骤
- ✅ 容易出现人为错误
- ✅ 耗时较长（>5分钟）
- ✅ 阻碍其他工作

**常见候选任务：**
- 数据库迁移
- 环境搭建
- 数据导入/导出
- 报表生成
- 部署步骤
- 代码格式化
- 测试数据创建

## 从小处着手：脚本库

创建一个 `scripts/` 目录，存放专注的工具脚本：

```
project/
├── scripts/
│   ├── setup-dev.sh          # 一条命令搭建开发环境
│   ├── deploy-staging.sh     # 安全的部署流程
│   ├── backup-db.sh          # 自动备份
│   ├── generate-report.py    # 周度指标
│   └── cleanup-old-data.sh   # 维护任务
└── README.md                 # 如何使用脚本
```

### 示例：开发环境搭建脚本

```bash
#!/bin/bash
# scripts/setup-dev.sh - 一条命令搭建开发环境

set -e  # 遇错退出

echo "🚀 正在搭建开发环境..."

# 检查前置条件
command -v docker >/dev/null 2>&1 || { echo "❌ 需要 Docker"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ 需要 Docker Compose"; exit 1; }

# 启动服务
echo "📦 正在启动数据库和缓存..."
docker-compose up -d db redis

# 等待服务就绪
echo "⏳ 等待数据库..."
until docker-compose exec db pg_isready -U postgres; do
  sleep 1
done

# 运行迁移
echo "🔄 正在运行数据库迁移..."
docker-compose run --rm web python manage.py migrate

# 加载测试数据（可选）
if [ "$1" == "--with-data" ]; then
  echo "📊 加载测试数据..."
  docker-compose run --rm web python manage.py loaddata fixtures/dev_data.json
fi

echo "✅ 开发环境就绪！"
echo "   应用: http://localhost:8000"
echo "   管理后台: http://localhost:8000/admin"
```

## 基于模板的自动化

对于重复性文档创建，使用变量替换模板：

### 示例：项目启动模板生成器

```python
#!/usr/bin/env python3
# scripts/create-project.py

import sys
from datetime import datetime
from pathlib import Path

def create_project_kickoff(name, description, po, tech_lead):
    template = Path("scripts/templates/project-kickoff.md").read_text()
    
    content = template.replace("{{PROJECT_NAME}}", name)
    content = content.replace("{{DESCRIPTION}}", description)
    content = content.replace("{{PO_NAME}}", po)
    content = content.replace("{{TECH_LEAD}}", tech_lead)
    content = content.replace("{{KICKOFF_DATE}}", datetime.now().strftime("%Y-%m-%d"))
    
    output_path = Path(f"docs/{name.lower().replace(' ', '-')}-kickoff.md")
    output_path.write_text(content)
    print(f"✅ 已创建 {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("用法: create-project.py <名称> <描述> <产品负责人> <技术负责人>")
        sys.exit(1)
    
    create_project_kickoff(*sys.argv[1:])
```

## 使用 Cron 定时自动化

```bash
# 编辑 crontab
crontab -e

# 添加条目
# 每天凌晨2点备份
0 2 * * * /path/to/scripts/backup-db.sh >> /var/log/backups.log 2>&1

# 每周一上午9点生成周报
0 9 * * 1 /path/to/scripts/generate-report.py --email team@company.com

# 每月1号凌晨3点清理
0 3 1 * * /path/to/scripts/cleanup-old-data.sh --days 90
```

## Git Hooks 作为质量门禁

```bash
# .git/hooks/pre-commit
#!/bin/bash

echo "🔍 运行提交前检查..."

# 格式检查
if ! black --check .; then
  echo "❌ 代码未格式化。请先运行 'black .'"
  exit 1
fi

# 类型检查
if ! mypy src/; then
  echo "❌ 发现类型错误。"
  exit 1
fi

# 快速测试
if ! pytest tests/unit/ -q; then
  echo "❌ 单元测试失败。"
  exit 1
fi

echo "✅ 所有检查通过！"
```

## 监控自动化效果

```python
# scripts/monitor-automation.py
import json
from datetime import datetime
from pathlib import Path

LOG_FILE = Path("logs/automation.log")

def log_execution(script_name, success, duration_seconds, error=None):
    entry = {
        "timestamp": datetime.now().isoformat(),
        "script": script_name,
        "success": success,
        "duration": duration_seconds,
        "error": error
    }
    
    LOG_FILE.parent.mkdir(exist_ok=True)
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps(entry) + "\n")

def generate_report():
    """展示自动化效果"""
    if not LOG_FILE.exists():
        print("未找到自动化日志")
        return
    
    executions = []
    for line in LOG_FILE.read_text().splitlines():
        executions.append(json.loads(line))
    
    total = len(executions)
    successful = sum(1 for e in executions if e["success"])
    avg_duration = sum(e["duration"] for e in executions) / total if total else 0
    
    print(f"自动化报告:")
    print(f"  总运行次数: {total}")
    print(f"  成功率: {successful/total*100:.1f}%")
    print(f"  平均耗时: {avg_duration:.1f}s")
    print(f"  预估节省时间: ~{total * 5} 分钟")
```

## 何时升级

从脚本迁移到正式 CI/CD 的时机：
- 自动化脚本超过10个
- 多人维护这些脚本
- 需要并行执行
- 合规要求审计跟踪
- 脚本变得复杂（超过100行）

在此之前，保持简单。

## 常见陷阱

### ❌ 过度自动化
自动化每周都在变化的事情会带来维护负担。

**修复：** 先自动化稳定的流程。等待模式形成后再下手。

### ❌ 缺乏错误处理
脚本静默失败，无人知晓。

**修复：** 始终记录失败日志，为关键自动化发送告警。

### ❌ 隐藏知识
只有一个人知道脚本如何工作。

**修复：** 在 README 中为每个脚本附上使用示例。

### ❌ 脆弱的依赖
工具更新时脚本损坏。

**修复：** 锁定版本，在依赖更新后测试。

## 衡量投资回报

跟踪节省的时间：

```
手动任务: 15分钟 × 每周3次 = 45分钟/周
自动化: 5分钟搭建 + 2分钟/周维护 = 7分钟/周
净节省: 38分钟/周 = 33小时/年
```

即使每周只节省30分钟，一年下来也是可观的收益。

## 结论

从脚本开始。掌握基础。然后在需要时扩展。大多数团队不需要复杂的自动化平台——他们需要今天就能省时的可靠、简单的脚本。

自动化无聊的部分。把精力集中在有趣的问题上。
