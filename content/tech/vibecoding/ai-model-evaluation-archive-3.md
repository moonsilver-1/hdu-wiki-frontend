---
title: "AI 编程模型评测：版本与产品线历史样本（三）"
date: "2026-08-09"
author: "TNHTH"
section: "vibecoding"
excerpt: "整理模型评测资料中的后续版本与综合对比，所有排名和能力描述均为历史样本。"
tags: ["AI编程", "模型评测", "大模型", "历史资料"]
---

> 本篇承接模型评测历史样本，重点记录后续版本和综合对比。模型会持续更新，当前能力请以官方文档和实测为准。

## Kimi-K3发布，超过GPT-5.6？比肩Fable-5?

> 本文根据公开飞书教程整理，原始页面：[Kimi-K3发布，超过GPT-5.6？比肩Fable-5?](https://my.feishu.cn/wiki/IjAewIEtliAmFZkIcawcfwxQnIc)。
> 安装命令、登录方式和功能说明会随版本变化，操作前请优先查看官方文档。

### 介绍

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

> 原文此处包含图片，当前版本保留文字说明；请查看原始飞书页面中的图片。

### 编程测试

#### 反攻精英1.6 网页版

```text

## 网页版 CS1.6 可玩原型

    ## 目标

    在浏览器中交付一个**可玩的 CS 风格 FPS 原型**，核心卖点是**真实的武器效果与射击效果**：后坐、扩散、枪口焰、曳光、
    弹孔、分枪种音效、第一人称枪模抖动，再配合买枪、简易 Dust 风地图、对战 Bot，跑通「进局 → 买枪 → 交火 → 回合结算」
    闭环。

    不做：真实联机、完整武器表、精确命中箱、反作弊、匹配大厅。

    ## 技术栈

    - **Vite + TypeScript**：项目脚手架与热更新
    - **Three.js**：渲染、相机、场景、枪模与粒子特效
    - **自研逻辑**：输入、移动、射击、伤害、经济、Bot、回合
    - **无物理引擎**：用 AABB / 射线检测做碰撞与命中（轻量可控）
    - **Web Audio**：分枪种枪声与击中反馈（短采样或程序合成）

    ## 核心玩法范围（MVP）
                                                                                                                     
    - **移动**：WASD、跳跃、蹲下、地面碰撞                                                                           
    - **视角**：Pointer Lock 鼠标视角                                                                                
    - **武器**：刀、Glock、USP、AK-47、M4A1、AWP（各有独立手感参数）                                                 
    - **射击手感（重点）**：后坐力、精准度扩散、移动惩罚、蹲下加成、准星动态开合                                     
    - **射击视效（重点）**：枪口闪光、曳光弹道、墙面弹孔、击中火花/血迹、弹壳抛出、枪模后坐动画                      
    - **射击听感（重点）**：分枪种枪声、换弹、空仓、击中肉体/金属、脚步                                              
    - **地图**：一张简化竞技场（双出生点 + 中路掩体，Dust 配色）                                                     
    - **对手**：3–5 个简易 Bot（巡逻、看见就开枪）                                                                   
    - **模式**：回合制死亡竞赛：一方全灭或时间到 → 结算 → 下一回合                                                   
    - **HUD**：血量、护甲、弹药、金钱、击杀提示、动态准星                                                            
                                                                                                                     
    ## 武器与射击效果（本原型重点）                                                                                  
                                                                                                                     
    每把枪用独立数据驱动，避免「所有枪一个手感」：                                                                   
                                                                                                                     
                                                                                                                     
    | 枪           | 手感特征                       |                                                                
    | ----------- | -------------------------- |                                                                     
    | Glock / USP | 半自动、后坐小、射速中等、手枪枪声短促        |                                                  
    | AK-47       | 高伤害、垂直后坐大、水平摆动、枪声厚重        |                                                  
    | M4A1        | 射速快、后坐更可控、枪声偏脆             |                                                       
    | AWP         | 一击重伤/爆头秒杀、开镜（简化右键）、强后坐与长换弹 |                                            
    | 刀           | 近战挥砍判定、无弹道特效               |                                                        
                                                                                                                     
                                                                                                                     
    ### 手感系统                                                                                                     
                                                                                                                     
    - **后坐力**：开火抬升 pitch + 轻微 yaw 抖动，按武器曲线衰减回中                                                 
    - **精准度**：静止 / 移动 / 跳跃 / 蹲下四档扩散；连发时扩散累积，停火后回收                                      
    - **准星**：根据当前扩散实时开合（CS 风格十字准星）                                                              
    - **换弹**：弹药归零或按 R；播放枪模下移/上弹动画与音效                                                          
    - **第一人称枪模**：低模枪体挂在相机下；开火 kick、换弹、切枪过渡                                                
                                                                                                                     
    ### 视效系统                                                                                                     
                                                                                                                     
    - **枪口闪光**：短寿命点光 + 平面 sprite，随射速闪烁                                                             
    - **曳光**：hitscan 同时画一条短暂线段（步枪/狙击更明显）                                                        
    - **弹孔**：命中墙体贴 decal，数量上限循环复用                                                                   
    - **击中反馈**：打中 Bot 出血迹 sprite；打中金属/墙出火花粒子                                                    
    - **弹壳**：从枪侧抛出短寿命 mesh，带简单重力后消失                                                              
    - **受击**：屏幕边缘闪红、轻微视角震动                                                                           
                                                                                                                     
    ### 听感系统                                                                                                     
                                                                                                                     
    - 每把枪独立开火音；换弹、空仓咔哒、击中肉体、击中墙面、脚步分轨                                                 
    - 用 Web Audio 控制音量与轻微随机 pitch，避免机械重复                                                            
                                                                                                                     
    ## 架构                                                                                                          
                                                                                                                     
    ```mermaid                                                                                                       
    flowchart TB                                                                                                     
      subgraph client [Browser Client]                                                                               
        Input[InputSystem]                                                                                           
        Game[GameLoop]                                                                                               
        World[WorldScene]                                                                                            
        Combat[CombatSystem]                                                                                         
        WeaponFX[WeaponFX]                                                                                           
        Audio[AudioSystem]                                                                                           
        Economy[BuyEconomy]                                                                                          
        Bots[BotAI]                                                                                                  
        HUD[HUDOverlay]                                                                                              
      end                                                                                                            
      Input --> Game                                                                                                 
      Game --> World                                                                                                 
      Game --> Combat                                                                                                
      Combat --> WeaponFX                                                                                            
      Combat --> Audio                                                                                               
      Game --> Economy                                                                                               
      Game --> Bots                                                                                                  
      Game --> HUD                                                                                                   
      Combat --> World                                                                                               
      Bots --> Combat                                                                                                
    ```                                                                                                              
                                                                                                                     
                                                                                                                     
                                                                                                                     
    建议目录：                                                                                                       
                                                                                                                     
    ```                                                                                                              
    src/                                                                                                             
      main.ts                                                                                                        
      game/Game.ts                                                                                                   
      core/Input.ts                                                                                                  
      core/Math.ts                                                                                                   
      world/Map.ts                                                                                                   
      world/Collision.ts                                                                                             
      player/Player.ts                                                                                               
      weapons/                                                                                                       
        WeaponController.ts                                                                                          
        ViewModel.ts       # 第一人称枪模与动画                                                                      
      combat/                                                                                                        
        Hitscan.ts                                                                                                   
        Effects.ts         # 枪口焰、曳光、弹孔、火花、弹壳                                                          
      audio/Audio.ts                                                                                                 
      bots/BotController.ts                                                                                          
      ui/HUD.ts                                                                                                      
      ui/BuyMenu.ts                                                                                                  
      style.css                                                                                                      
    ```                                                                                                              
                                                                                                                     
    ## 实现顺序

    ### 1. 工程骨架

    - 初始化 Vite + TS + Three.js
    - 全屏 canvas、基础场景、Pointer Lock 与第一人称相机

    ### 2. 移动与碰撞

    - AABB 玩家体、重力、跳跃、蹲下
    - 地图用 `BoxGeometry` 拼墙体与掩体

    ### 3. 武器手感（优先做真）

    - 武器数据表 + Hitscan
    - 后坐、扩散、移动惩罚、准星开合
    - 第一人称低模枪模 + 开火 kick / 换弹动画

    ### 4. 射击视效与听感（优先做真）

    - 枪口闪光、曳光、弹孔、火花/血迹、弹壳
    - 分枪种音效与击中反馈
    - 受击闪红与视角震动

    ### 5. 地图与出生                                                                                                
                                                                                                                     
    - 对称竞技场、T/CT 出生点、回合重置                                                                              
                                                                                                                     
    ### 6. 经济与买枪                                                                                                
                                                                                                                     
    - 金钱、击杀/回合奖励、`B` 买枪菜单                                                                              
                                                                                                                     
    ### 7. Bot AI                                                                                                    
                                                                                                                     
    - 巡逻 → 发现玩家射击 → 死亡等下回合                                                                             
    - Bot 开火同样走同一套特效与音效管线                                                                             
                                                                                                                     
    ### 8. 回合与 HUD                                                                                                

    - `Warmup → BuyTime → Live → RoundEnd`
    - HUD：血甲、弹药、金钱、击杀 feed、动态准星

    ### 9. 验收打磨

    - 对比各枪手感差异是否明显；三回合闭环可玩

    ## 验收标准

    - 打开页面即可 Pointer Lock 进入游戏
    - **AK / M4 / AWP / 手枪手感与视听效果可明显区分**
    - 开火可见枪口焰、曳光、弹孔；击中 Bot 有血迹与击中音
    - 能买枪、击杀 Bot、被击杀，打完至少 3 个回合并看到金钱变化
    - 桌面 Chrome/Edge 目标 ~60fps

    ## 明确不做（避免膨胀）

    - WebSocket 多人联机
    - 真实 CS 地图导入 / BSP
    - 完整 30+ 武器与皮肤工坊
    - 真实体积烟雾弹 / 闪光致盲全屏物理
    - 移动端触控适配（可后续加）
    - 高精度骨骼枪模与原版 1:1 弹道（用低模 + 数据驱动逼近手感）
```

#### 3D动态效果测试

```text
Create a complete interactive 3D web experience titled “Storm Lighthouse” using Three.js.
The entire project must run directly in the browser. Prefer a single HTML file containing the HTML, CSS, and JavaScript. External CDN imports are allowed, but do not use prebuilt 3D models, textures, game engines, or downloaded assets. Build the environment procedurally with Three.js geometry, shaders, canvas-generated textures, particles, lights, and code.
SCENE
Create a nighttime ocean scene during a violent storm.
In the center of the scene, place a tall lighthouse standing on a group of dark, irregular coastal rocks. The lighthouse should include:
A cylindrical stone tower with visible surface variation.
A doorway, several windows, railings, and a detailed observation platform.
A glass lantern room at the top.
A rotating lighthouse lamp.
A visible volumetric-looking light beam that sweeps across the ocean.
Warm interior lighting visible through the windows.
The lighthouse and rocks must not look like primitive placeholder shapes. Combine multiple procedural geometries, materials, surface details, color variations, and lighting effects to create a convincing structure.
OCEAN
Create a large animated ocean surrounding the lighthouse.
The ocean must:
Have continuously moving waves.
Use layered wave movement rather than moving the entire surface as one flat object.
Reflect moonlight, lightning, and the lighthouse beam.
Become brighter and slightly transparent near wave crests.
Produce foam around the rocks.
Include floating debris or wooden objects that rise, fall, tilt, and rotate with the waves.
The ocean should feel deep, heavy, and stormy rather than like a flat blue plane.
WEATHER
Create a complete storm system containing:
Thousands of animated rain particles.
Wind that pushes rain diagonally.
Moving dark cloud layers.
Semi-transparent fog over the ocean.
Random lightning flashes.
A visible lightning bolt during some flashes.
Brief illumination of the lighthouse, rocks, ocean, and clouds when lightning occurs.
Optional distant thunder timing shown visually through delayed flashes or screen vibration.
Rain should react convincingly to the camera and environment. Avoid making it look like a static particle curtain.
LIGHTHOUSE BEAM
The lighthouse lamp must rotate continuously.
Create a convincing sweeping beam by combining:
A spotlight that illuminates objects.
A semi-transparent cone or custom shader for the visible beam.
Fog interaction or layered transparent geometry.
A brighter center and softer outer edge.
Reduced visibility when the beam points away from the camera.
Light reflections or bright streaks where the beam touches the ocean.
The beam must illuminate the rocks, rain, ocean, floating objects, and distant boat when they enter its path.
DISTANT BOAT
Place a small rescue boat far from the lighthouse.
The boat should:
Be constructed procedurally from multiple geometries.
Move vertically and tilt according to the waves.
Drift slowly across the ocean.
Include a small blinking navigation light.
Become clearly visible when illuminated by the lighthouse beam or lightning.
Do not use a downloaded boat model.
INTERACTION
Add the following controls:
Mouse drag to orbit around the lighthouse.
Mouse wheel to zoom.
Keyboard WASD controls for limited camera movement.
A button labeled “Emergency Mode”.
A button labeled “Normal Mode”.
A slider controlling storm intensity.
A slider controlling ocean wave height.
A toggle for automatic camera movement.
A button to reset the camera.
When Emergency Mode is activated:
The lighthouse beam changes from warm white to red.
The lamp rotates faster.
The boat navigation light flashes more rapidly.
Storm intensity increases slightly.
The lighthouse beam begins tracking the boat for several seconds before returning to its normal rotation.
A subtle warning interface appears on screen.
CAMERA
Include two camera behaviors:
Free exploration mode.
Cinematic automatic camera mode.
The cinematic camera should smoothly move through several viewpoints:
Low over the ocean approaching the rocks.
Looking upward from the base of the lighthouse.
Circling the lantern room.
Following the rotating light beam.
Moving toward the distant boat.
Pulling back to reveal the entire storm scene.
Camera movement must use smooth interpolation and should not jump abruptly between positions.
VISUAL QUALITY
Include:
Physically based materials where appropriate.
Dynamic shadows.
Tone mapping.
Fog.
Bloom or glow effects for the lighthouse lamp, lightning, and boat lights.
Subtle screen-space effects or post-processing when supported.
Responsive rendering for different browser sizes.
A clean cinematic user interface.
A loading indicator.
A real-time FPS display.
A quality selector with Low, Medium, and High settings.
Avoid excessive bloom, oversaturated colors, and completely black shadow areas. The lighthouse must remain readable during the storm.
PERFORMANCE
The animation should remain smooth on a typical desktop browser.
Use appropriate techniques such as:
Instanced geometry for rain or repeated objects.
Reduced particle counts on lower quality modes.
Limited shadow-casting lights.
Efficient geometry updates.
Reusing materials and geometries.
Capping the device pixel ratio.
Pausing or reducing animation when the page is not visible.
Do not recreate large geometries or materials every animation frame.
CODE QUALITY
Organize the JavaScript into clear systems or classes, such as:
SceneManager
OceanSystem
WeatherSystem
LighthouseSystem
BoatSystem
CameraController
InteractionController
QualityManager
Add comments explaining the important 3D techniques.
The project must not contain placeholder comments such as “add ocean here” or “implement later”. Every requested major feature must be implemented.
FINAL RESULT
The final result should feel like a small cinematic 3D experience rather than a basic Three.js demonstration.
The scene should immediately communicate:
A dangerous storm.
A powerful lighthouse.
A moving ocean.
Strong depth and atmosphere.
A rescue situation involving the distant boat.
Meaningful interaction between light, weather, water, and objects.
Return the complete runnable code.
```

参与测试模型：

GPT-5.6-SOL

Fable-5

GLM-5.2

Kimi-K3

### 测试结果

Fable-5>GPT-5.6-SOL>Kimi-K3>GLM5.2

### 资料范围

本篇覆盖 GLM、MiniMax、Kimi、Qwen、Gemini 与后续模型 的公开评测条目。评测中的排名、速度和“最强”表述都只对应原文写作时的环境，不能直接推断今天的结果。

### 资料范围

本篇保留原知识库中后续模型条目，并去除重复标题与推广信息；其中的结论只代表原始评测时点。

## 官方核验与使用建议

后续模型的名称、版本和接口变化很快，实际使用前请回到对应厂商的官方模型页和开发者文档，重新确认可用区域、上下文限制、工具调用方式和数据处理条款。
