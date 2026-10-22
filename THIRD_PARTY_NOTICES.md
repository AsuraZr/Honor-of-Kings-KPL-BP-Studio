# Third-Party Notices / 第三方说明

本项目原创代码采用根目录 [LICENSE](LICENSE) 中的 **PolyForm Noncommercial License 1.0.0**（源码公开的非商业许可，不属于 OSI 开源许可）。

**重要：该许可证只覆盖本项目作者拥有版权的原创代码，不覆盖下列第三方数据、图片、商标或依赖。**

## 1. 官方赛事数据与游戏素材

- 赛事赛程、BP、选手与战队数据来自腾讯王者荣耀官方赛事接口及 KPL 官方页面。
- `web/assets/heroes/`、`web/assets/teams/`（如存在）、`docs/` 截图中的英雄头像、战队 Logo、游戏画面，以及 `data/snapshot.json`、`data/cache/` 中的官方数据，其版权归腾讯 / 王者荣耀 / KPL 及相关权利人所有。
- 这些内容仅用于本地学习、分析和非商业演示，**不随本项目的 PolyForm Noncommercial 许可证授权**。
- 如果要公开托管仓库或商业分发，建议：
  - 不把官方图片和官方数据快照提交到公开仓库；
  - 仓库只保留代码和同步脚本，由使用者在本机运行同步；
  - 或自行取得相关权利人的授权。
- 本项目与腾讯、王者荣耀、KPL、B 站均无官方隶属关系。

## 2. 开源依赖

| 依赖 | 用途 | 许可证 |
|---|---|---|
| Python | 运行时 | PSF License |
| NumPy | 图像数组计算 | BSD-3-Clause |
| OpenCV (`opencv-python-headless`) | 英雄头像模板匹配 | Apache-2.0 |
| PyInstaller | Windows exe 打包 | GPL-2.0-or-later，附 bootloader exception（允许分发打包后的程序） |
| Windows OCR | 可选的文字识别 | Microsoft Windows 系统组件，不随本项目分发 |

分发 exe 或二进制包时，请随包保留本文件和根目录 `LICENSE`，并遵守上述依赖的许可证要求。各依赖的完整许可证文本可在其官方仓库或安装包中找到。

## 3. 商标

“王者荣耀”“KPL”“B站/bilibili”等名称和标识属于其各自权利人。本项目仅作说明和兼容性使用，不代表官方认可或授权。
