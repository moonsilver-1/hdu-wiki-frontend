---
title: "深度学习环境版本关系：驱动、CUDA、cuDNN 与 PyTorch"
date: "2026-09-28"
author: "paperkite"
section: "tool-use"
excerpt: "梳理 NVIDIA 驱动、CUDA Toolkit、CUDA Runtime、cuDNN 与 PyTorch 的依赖关系，并提供安装选择、环境检查和常见报错的定位方法。"
tags: ["CUDA", "PyTorch", "cuDNN", "显卡驱动", "深度学习", "环境配置"]
---

深度学习环境中常见的 NVIDIA 驱动、CUDA、cuDNN 和 PyTorch 分属不同层级。理解它们的依赖方向，就能快速判断该安装什么、该检查哪里。

本文以 NVIDIA GPU 和 PyTorch 为例。GPU 选型可参阅[《云 GPU 选型指南》](/tech/cloud-gpu-selection-guide)，云端连接与脚本执行可参阅[《云实例使用指南》](/tech/cloud-instance-ssh-agent-guide)。

## 先记住依赖方向

可以把整个环境看成一座分层结构：

```text
训练代码
  ↓
PyTorch
  ↓
CUDA Runtime + cuDNN 等运行库
  ↓
NVIDIA 显卡驱动
  ↓
NVIDIA GPU
```

上层软件通过下层能力访问 GPU。排错时从底层向上检查：先看驱动能否识别 GPU，再看 PyTorch 是否包含 CUDA 支持，最后看项目代码是否把模型和张量放到 GPU。

## NVIDIA 显卡驱动

显卡驱动负责操作系统与 GPU 通信。执行下面的命令可以查看驱动、GPU 和进程：

```bash
nvidia-smi
```

输出中常见三项：

- `Driver Version`：当前安装的 NVIDIA 驱动版本；
- `CUDA Version`：该驱动能够支持的最高 CUDA 兼容版本；
- GPU 型号、显存占用、利用率和正在使用 GPU 的进程。

`nvidia-smi` 中的 `CUDA Version` 表示驱动能力上限。PyTorch 实际使用的 CUDA Runtime 版本需要通过 `torch.version.cuda` 查看。

云平台的深度学习镜像通常已经配置驱动。用户在 Python 虚拟环境中安装 PyTorch，即可复用宿主机驱动。

## CUDA Toolkit

CUDA Toolkit 是面向 CUDA 开发的完整工具包，常见内容包括：

- `nvcc` CUDA 编译器；
- 头文件和开发库；
- 调试、分析和编译工具；
- CUDA 示例与开发组件。

通过下面的命令查看 Toolkit 中的编译器版本：

```bash
nvcc --version
```

Toolkit 主要服务于编译 CUDA 程序和 PyTorch CUDA 扩展。直接使用官方 PyTorch wheel 运行常规模型时，wheel 通常会携带所需 CUDA Runtime 及相关运行库，此时系统级 Toolkit 主要承担自定义扩展的编译工作。

因此，`nvidia-smi` 正常而 `nvcc` 命令缺席，依然可以构成一个完整的 PyTorch 运行环境。项目需要编译自定义 CUDA 算子时，再根据 PyTorch 构建版本配置匹配的 Toolkit。

## CUDA Runtime

CUDA Runtime 是程序运行 CUDA 内核时使用的运行时库。它与完整 Toolkit 的角色有所区别：

- Runtime 支撑已编译程序运行；
- Toolkit 提供编译器、头文件和开发工具；
- NVIDIA 驱动负责将运行时请求交给 GPU。

PyTorch 官方安装包会针对特定 CUDA Runtime 构建。安装命令中的 `cuXXX` 通常代表该构建使用的 CUDA 大版本，例如 `cu121` 表示 CUDA 12.1 构建。具体可用构建应以 [PyTorch 官方安装页面](https://pytorch.org/get-started/locally/) 为准。

在 Python 中查看 PyTorch 构建所使用的 Runtime 版本：

```python
import torch

print(torch.__version__)
print(torch.version.cuda)
```

## cuDNN

cuDNN 是 NVIDIA 面向深度神经网络提供的加速库，包含卷积、归一化、激活和注意力相关操作的优化实现。PyTorch 会在合适的算子中调用它。

通过 PyTorch 查看 cuDNN 信息：

```python
import torch

print(torch.backends.cudnn.is_available())
print(torch.backends.cudnn.version())
```

官方 PyTorch wheel 或 Conda 包通常会安装匹配的 cuDNN 运行库。使用系统级 CUDA、自行编译 PyTorch 或构建自定义镜像时，需要手动确认 cuDNN 与 CUDA 的兼容关系。

## PyTorch 的版本包含什么信息

同一个 PyTorch 版本可能提供多种构建：

- CPU 构建：适合 CPU 环境；
- CUDA 构建：针对某个 CUDA Runtime 版本打包；
- 特定平台构建：根据操作系统和包管理方式提供。

安装完成后，可以运行一段完整检查：

```python
import torch

print("PyTorch:", torch.__version__)
print("Built with CUDA:", torch.version.cuda)
print("CUDA available:", torch.cuda.is_available())
print("cuDNN available:", torch.backends.cudnn.is_available())
print("cuDNN version:", torch.backends.cudnn.version())

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
    print("Device capability:", torch.cuda.get_device_capability(0))
```

`torch.cuda.is_available()` 返回 `True`，代表 PyTorch 已经找到可用的 CUDA 设备。

## 驱动与 Runtime 怎样兼容

驱动需要覆盖 PyTorch 所带 CUDA Runtime 的最低要求。新版 NVIDIA 驱动通常可以运行面向较早 CUDA Runtime 构建的应用，这体现了驱动的向后兼容能力。

可以采用下面的选择顺序：

1. 根据项目要求选择 PyTorch 版本；
2. 在 PyTorch 官方页面选择该版本提供的 CUDA 构建；
3. 在 NVIDIA 官方兼容性资料中确认所需最低驱动；
4. 选择达到该要求的云镜像或更新驱动；
5. 需要编译扩展时，再配置对应的 CUDA Toolkit 和编译器。

权威参考包括 [PyTorch 安装说明](https://pytorch.org/get-started/locally/)、[NVIDIA CUDA 兼容性文档](https://docs.nvidia.com/deploy/cuda-compatibility/)和项目自身的安装说明。

## 三个版本号为什么经常不同

一台机器可能同时显示：

```text
nvidia-smi        -> CUDA 12.x
nvcc --version    -> CUDA 11.x
torch.version.cuda -> CUDA 12.y
```

这三个结果各自描述一个层级：

| 查看方式 | 描述对象 | 主要用途 |
| --- | --- | --- |
| `nvidia-smi` | 驱动支持的最高 CUDA 兼容版本 | 判断驱动能力 |
| `nvcc --version` | 当前 CUDA Toolkit 编译器版本 | 编译 CUDA 代码与扩展 |
| `torch.version.cuda` | 当前 PyTorch 构建使用的 CUDA Runtime 版本 | 判断 PyTorch 运行库 |

版本号存在差异属于常见情况。只要驱动满足 Runtime 要求，PyTorch 就可以正常使用 GPU；编译自定义扩展时，还要让 Toolkit、编译器与 PyTorch 构建相互兼容。

## 推荐的安装路径

### 云平台深度学习镜像

这是入门和训练任务中最直接的路径：

1. 选择平台提供的 PyTorch 镜像；
2. 使用 `nvidia-smi` 检查 GPU 和驱动；
3. 使用 Python 检查 `torch.cuda.is_available()`；
4. 为项目创建独立虚拟环境；
5. 按项目要求安装额外依赖；
6. 用小数据运行短测试。

### 在已有驱动的机器上安装 PyTorch

先确认 `nvidia-smi` 可以识别 GPU，再从 PyTorch 官方页面选择适合系统和包管理器的安装命令。官方命令会选择匹配的 PyTorch 与 CUDA Runtime 包。

### 需要编译自定义 CUDA 扩展

这类项目还需要关注：

- CUDA Toolkit 与 `nvcc`；
- C/C++ 编译器版本；
- PyTorch 构建对应的 CUDA 版本；
- 扩展项目支持的 PyTorch 和 GPU 架构；
- `CUDA_HOME` 等构建环境变量。

项目文档通常会给出推荐组合。把这一组版本写入安装脚本、容器文件或环境清单，后续复现会更稳定。

## 常见问题怎样定位

### `nvidia-smi` 运行报错

检查实例是否分配了 GPU、驱动是否加载、容器是否获得 GPU 设备访问权限。云平台场景可以先核对实例类型和镜像说明。

### `torch.cuda.is_available()` 返回 `False`

依次查看：

1. `nvidia-smi` 是否识别 GPU；
2. `torch.__version__` 和 `torch.version.cuda`；
3. 当前 Python 是否来自预期虚拟环境；
4. 安装的 PyTorch 是否为 CUDA 构建；
5. 驱动是否满足该 Runtime 的最低要求。

### `CUDA driver version is insufficient`

这条信息表示当前驱动版本低于应用所需范围。可以选择包含更新驱动的镜像，或者选择与当前驱动兼容的 PyTorch CUDA 构建。

### `no kernel image is available for execution`

这类错误通常与 GPU 计算能力和已编译内核架构有关。检查 GPU 型号、PyTorch 支持范围，以及自定义扩展的架构编译参数。

### 编译扩展时出现 CUDA 版本提示

编译过程会同时接触 PyTorch 构建版本和本机 Toolkit。使用项目推荐的 PyTorch、Toolkit、编译器组合，并清理旧构建缓存后重新编译。

### 程序占用了 CPU

确认模型与输入张量已经移动到同一 CUDA 设备：

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
inputs = inputs.to(device)
```

随后通过 `nvidia-smi` 和训练吞吐观察实际运行状态。

## 用脚本保存环境信息

每次训练前记录环境，可以提高复现和排错效率：

```bash
#!/usr/bin/env bash
set -euo pipefail

mkdir -p logs
nvidia-smi > logs/nvidia-smi.txt
python --version > logs/python-version.txt 2>&1
python -m pip freeze > logs/requirements-lock.txt

python - <<'PY' > logs/torch-environment.txt
import torch

print("PyTorch:", torch.__version__)
print("CUDA runtime:", torch.version.cuda)
print("CUDA available:", torch.cuda.is_available())
print("cuDNN:", torch.backends.cudnn.version())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
    print("Capability:", torch.cuda.get_device_capability(0))
PY
```

把脚本输出与训练配置、Git 提交号和模型检查点一起保存，Agent 或队友就能基于同一组事实进行诊断。

## 最后总结

这组关系可以浓缩成四句话：

1. 驱动让操作系统和应用访问 GPU；
2. CUDA Runtime 支撑已编译的 CUDA 程序运行；
3. CUDA Toolkit 提供编译器和开发工具；
4. PyTorch 调用 CUDA Runtime 与 cuDNN 完成深度学习计算。

安装时优先选择平台镜像或 PyTorch 官方命令，排错时沿着“GPU → 驱动 → PyTorch 构建 → 项目代码”的顺序逐层检查。这样可以把复杂的版本问题拆成几个清晰、可验证的环节。
