---
title: "云实例使用指南：用 SSH、脚本和 Agent 完成远程任务"
date: "2026-09-28"
author: "paperkite"
section: "tool-use"
excerpt: "以 AutoDL 为例，从创建实例到 SSH 连接、发送并运行脚本、管理模型训练和备份结果，并介绍如何让代码 Agent 辅助远程工作。"
tags: ["云服务器", "云GPU", "SSH", "Agent", "AutoDL", "模型训练"]
---

使用云实例可以从一套精简流程开始：创建实例、通过 SSH 连接、发送脚本、运行任务、查看日志、下载结果和关机。

代码 Agent 可以帮助阅读项目、生成安装脚本、解释报错和执行测试。你负责审核涉及删除文件、修改权限、开放端口和安装系统软件的操作，具体命令则由脚本记录和复用。

云实例和云 GPU 的基础概念可参阅[《什么是云实例与云 GPU：它们能用来做什么》](/tech/cloud-instance-and-gpu-overview)。

## 开始前准备什么

本地电脑需要：

- 一个终端。Windows 可以直接使用 PowerShell；
- SSH 客户端，现代 Windows、macOS 和 Linux 通常已自带；
- 项目代码、训练脚本或准备上传的文件；
- 可选的代码 Agent 或支持 Remote SSH 的编辑器。

云端需要：

- 一台已开机的实例；
- 实例的 SSH 地址、端口、用户名和密码或私钥；
- 足够的 GPU 显存、磁盘和账户余额；
- 一个适合项目的深度学习镜像。

优先使用平台提供的 PyTorch、TensorFlow 等深度学习镜像。它们通常已经安装显卡驱动和 CUDA，比从纯净 Ubuntu 手动配置可靠。

## 以 AutoDL 为例创建实例

在 AutoDL 控制台选择地区、GPU 型号、GPU 数量、镜像和存储容量。第一次使用时，选择显存足够的 GPU 和预装框架的基础镜像即可，后续再根据监控结果升级性能。

需要重点确认：

1. GPU 显存能否容纳模型和训练 batch；
2. 镜像中的框架版本是否符合项目要求；
3. 数据盘能否容纳数据集、环境和检查点；
4. 当前实例是按量计费还是包年包月；
5. SSH 登录信息和开放端口在哪里查看。

### AutoDL 如何计费

下面依据 [AutoDL 官方“充值与计费”文档](https://www.autodl.com/docs/price/) 整理。GPU 单价会随型号、地区、主机和活动变化，应以创建实例页面的现价为准。

普通容器实例按量计费时，从开机开始计费、关机结束计费，时长精确到秒，最低计费 0.01 元。平台在整点结算一次，并在关机时结算剩余费用。实例的完整开机时段都会计费，包含 GPU 空闲时段。

```text
实例费用 = （关机时间 - 开机时间）× 页面显示的小时单价
```

例如页面单价为每小时 `P` 元，19:20 开机、22:50 关机，共 3.5 小时，则计算费用为 `3.5 × P` 元。即使只有 2 小时用于训练，其余时间在安装环境或忘记关机，仍按 3.5 小时收费。

按量实例关机后停止收取实例计算费用，GPU 随即回到公共资源池，下次开机需要重新匹配空闲 GPU。付费扩容数据盘单独计费，实例关机期间仍可能按日产生费用，直到缩容至免费容量以内或释放实例。Container Instance Pro 的系统盘也有独立计费规则。

包年包月属于预付费并预留 GPU，适合连续运行；整个租期持续计时，关机和 GPU 空闲时段也包含在内。短期、间歇性实验通常先使用按量计费更直观。

## 第一次通过 SSH 连接

假设平台给出的登录信息是：

```text
主机：connect.example.com
端口：12345
用户：root
```

在本地终端运行：

```bash
ssh -p 12345 root@connect.example.com
```

平台提供私钥登录时：

```bash
ssh -i ~/.ssh/cloud_key -p 12345 root@connect.example.com
```

首次连接会显示主机指纹。将它与平台提供的信息核对一致后再确认。

登录成功后，先做最小检查：

```bash
pwd
nvidia-smi
python --version
df -h
```

它们分别用于查看当前目录、GPU、Python 版本和磁盘空间。需要帮助时，可以把输出交给 Agent 解释，密码、访问令牌和私钥则始终保存在对话之外。

## 用脚本代替反复输入命令

把操作写成脚本，在本地检查后发送到云端，可以减少重复输入 Linux 命令。下面是一个基础环境检查脚本 `check_env.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Current directory: $(pwd)"
echo "Python: $(python --version 2>&1)"
echo "Disk usage:"
df -h .
echo "GPU status:"
nvidia-smi
```

使用 `scp` 将脚本发送到实例：

```bash
scp -P 12345 check_env.sh root@connect.example.com:~/check_env.sh
```

然后通过 SSH 直接执行：

```bash
ssh -p 12345 root@connect.example.com "bash ~/check_env.sh"
```

这就是最简单的“本地发脚本，云端执行，结果返回终端”通信方式。以后安装环境、拉取代码、启动训练和打包结果都可以采用同样模式。

### 使用私钥时

如果登录使用私钥，两条命令分别增加 `-i` 参数：

```bash
scp -i ~/.ssh/cloud_key -P 12345 check_env.sh root@connect.example.com:~/check_env.sh
ssh -i ~/.ssh/cloud_key -p 12345 root@connect.example.com "bash ~/check_env.sh"
```

注意 `scp` 的端口参数是大写 `-P`，`ssh` 的端口参数是小写 `-p`。

## 上传项目并启动任务

小型项目可以直接发送整个目录：

```bash
scp -P 12345 -r ./my-project root@connect.example.com:~/my-project
```

代码已经放在 Git 仓库时，也可以登录后克隆。私有仓库应使用权限受限的部署密钥或短期令牌，并将凭据保存在脚本和仓库之外。

建议给项目准备一个明确的入口脚本，例如 `run_train.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
mkdir -p outputs logs
python train.py --config configs/train.yaml 2>&1 | tee logs/train.log
```

首次运行前应让 Agent 或队友检查脚本，特别是 Python 版本、框架安装方式、数据路径和输出目录。然后上传并执行：

```bash
scp -P 12345 run_train.sh root@connect.example.com:~/my-project/run_train.sh
ssh -p 12345 root@connect.example.com "bash ~/my-project/run_train.sh"
```

先使用少量样本或少量 step 试跑，确认数据路径、显存、loss 和输出文件正常，再开始完整训练。

## 让任务在断开 SSH 后继续运行

普通 SSH 前台会话断开后，程序可能退出。可以使用 `tmux` 创建一个持久终端：

```bash
tmux new -s train
cd ~/my-project
bash run_train.sh
```

按 `Ctrl+B`，再按 `D` 可以离开会话。以后重新连接并恢复：

```bash
tmux attach -t train
```

也可以把启动过程写成脚本，让 SSH 创建后台会话：

```bash
ssh -p 12345 root@connect.example.com \
  "tmux new-session -d -s train 'cd ~/my-project && bash run_train.sh'"
```

查看日志：

```bash
ssh -p 12345 root@connect.example.com \
  "tail -n 100 ~/my-project/logs/train.log"
```

## Agent 可以怎样辅助

Agent 可以根据当前项目生成和调整脚本，让用户把精力放在目标、结果与风险审核上。常见的协作方式有两种。

### Agent 在本地，脚本发到云端

让本地 Agent 阅读项目中的 `README`、`requirements.txt`、训练入口和配置文件，请它生成：

- `check_env.sh`：检查 GPU、Python、磁盘和依赖；
- `setup.sh`：创建环境并安装依赖；
- `run_train.sh`：启动训练并记录日志；
- `download_results.sh`：打包并下载结果。

你审核脚本后，再通过 `scp` 上传并用 `ssh` 执行。这种方式让 Agent 保持在本地运行，也更容易控制 Agent 能接触的凭据。

可以这样描述任务：

```text
请阅读这个项目的依赖和训练入口，为 Ubuntu 云 GPU 实例生成 setup.sh 和
run_train.sh。脚本需要 set -euo pipefail，所有输出写入 logs，模型保存在
outputs，保留全部现有文件和当前防火墙配置。先解释将执行哪些操作。
```

### Agent 直接在远程项目中工作

使用支持 Remote SSH 的编辑器或在云端安装命令行 Agent 后，Agent 可以直接读取远程项目、运行环境检查和测试。这种方式反馈更快，但权限也更大。

使用前应做到：

- 将权限范围限定为完成任务所需的目录和命令；
- 将云平台密码、SSH 私钥和长期令牌保存在项目之外；
- 要求 Agent 在安装系统包、删除文件和修改网络设置前确认；
- 使用 Git 保存代码改动，用日志记录训练过程；
- 对费用相关操作仍由人确认，例如开机、扩容和长期运行。

Agent 给出的命令如果包含 `rm`、磁盘格式化、递归权限修改或向所有来源开放端口，应暂停并确认目标。命令审核是云端操作流程中的必要环节。

## 监控与排错

查看 GPU 使用情况：

```bash
nvidia-smi
```

持续刷新：

```bash
watch -n 2 nvidia-smi
```

常见问题可以按以下顺序处理：

- `CUDA out of memory`：先减小 batch size、输入尺寸或序列长度，再考虑混合精度、梯度累积和更大显存；
- GPU 利用率低：检查数据加载、CPU、磁盘和程序是否真的把模型放到了 GPU；
- `No space left on device`：用 `df -h` 检查磁盘，清理前先确认缓存和文件是否可删除；
- SSH 断开：确认实例仍开机，再检查地址、端口、安全组和本地网络；
- 依赖冲突：保存完整报错和版本信息，让 Agent 基于项目依赖修改环境脚本，每次集中调整驱动、CUDA 或框架中的一个层级。

排错时把命令、完整报错、项目依赖和 `nvidia-smi` 输出一起提供给 Agent，Agent 就能获得充分的诊断依据。

## 下载结果并停止计费

先在云端打包输出：

```bash
ssh -p 12345 root@connect.example.com \
  "cd ~/my-project && tar -czf results.tar.gz outputs logs"
```

再下载到本地：

```bash
scp -P 12345 root@connect.example.com:~/my-project/results.tar.gz ./results.tar.gz
```

下载后应实际解压并抽查模型、配置和日志，确认备份有效。最后在平台控制台关机，并检查费用明细。

结束前的检查清单：

1. 模型、日志、配置和必要数据已经备份；
2. 检查点可以正常加载；
3. 临时令牌已经撤销；
4. 按量实例已经关机；
5. 付费数据盘、镜像和文件存储是否仍需要保留；
6. 控制台中的持续计费资源均符合保留计划。

## 最小可行工作流

第一次使用时，掌握下面这条流程即可：

```text
控制台开机
  -> SSH 测试连接
  -> scp 发送项目和脚本
  -> SSH 执行环境检查
  -> 小数据试跑
  -> tmux 启动正式训练
  -> SSH 查看日志
  -> scp 下载并验证结果
  -> 控制台关机并检查账单
```

将重复步骤固化为脚本，让 Agent 负责生成、解释和迭代脚本，人负责审核权限、数据和费用，具备基础 Linux 概念即可可靠地使用云实例。

实例选型可参阅[《云 GPU 选型指南》](/tech/cloud-gpu-selection-guide)，驱动与框架配置可参阅[《深度学习环境版本关系》](/tech/deep-learning-environment-compatibility)。
