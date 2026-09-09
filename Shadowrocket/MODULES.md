# Ad-block Module Choices

主配置已经用 `AdvertisingLite` 做第一层域名/IP 广告过滤。下面的 Module 是第二层，用于开屏广告、响应体净化以及同域广告。

| 方案 | 用途 | 推荐程度 | 注意事项 |
|---|---|---:|---|
| Blackmatrix `AdvertisingScript.sgmodule` | 开屏 + 知乎等脚本净化 | 默认推荐 | 体量小、较容易排障 |
| fmz200 `blockAds.srmodule` | 国产 App 综合去广告 | 强力备选 | 规则很多，误杀概率更高 |
| fmz200 `weibo.srmodule` | 微博专项 | 按需 | 只在常用微博且通用模块效果不够时启用 |
| 本仓库 `CaiYunAds.sgmodule` | 彩云天气广告/活动推广净化 | 按需 | 仅去广告，不修改会员/VIP权限 |
| Blackmatrix Full `Advertising.list` | 超大域名广告集 | 不默认 | 比 AdvertisingLite 更重，手机常驻未必划算 |

## 推荐组合

### A. 稳定优先（默认）

- 主配置 `AdvertisingLite`
- `AdvertisingScript.sgmodule`

这是建议长期使用的起点。

### B. 国产 App 去广告优先

- 主配置 `AdvertisingLite`
- `blockAds.srmodule`
- 如仍需要，再增加 `weibo.srmodule`

不要一开始同时启用 `AdvertisingScript` + `blockAds` + 多个同类全家桶。重叠脚本越多，出现白屏、接口异常或无法登录时越难定位。

### C. 彩云天气专项

本仓库已经提供 Shadowrocket 专用模块：

```text
https://raw.githubusercontent.com/troyzx/QuanX/master/Shadowrocket/Modules/CaiYunAds.sgmodule
```

对应脚本：

```text
https://raw.githubusercontent.com/troyzx/QuanX/master/Shadowrocket/Scripts/caiyun_ads.js
```

功能范围：

- 图层/活动推广净化
- 首页顶部推广净化
- 消息中心/SVIP提醒推广净化
- 雨季弹窗与页面动作净化
- 发现页 feeds / banners / features / campaigns 净化
- `ad.cyapi.cn` 通用广告请求拦截

说明：该适配基于 @ddgksf2013 墨鱼版 V1.0.8 的去广告逻辑，仅迁移广告与推广内容净化，不包含会员/VIP权限修改。

使用时需要在 Shadowrocket 当前配置中开启 HTTPS 解密并安装、信任 CA 证书；模块自身使用 `%APPEND%` 添加需要解密的域名，不会覆盖其他模块的 MITM hostname。

## URL

```text
# Blackmatrix AdvertisingScript
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rewrite/Shadowrocket/AdvertisingScript/AdvertisingScript.sgmodule

# fmz200 comprehensive ad block
https://raw.githubusercontent.com/fmz200/wool_scripts/main/Shadowrocket/module/blockAds.srmodule

# fmz200 Weibo
https://raw.githubusercontent.com/fmz200/wool_scripts/main/Shadowrocket/module/weibo.srmodule

# CaiYun Weather ad cleanup (this repo)
https://raw.githubusercontent.com/troyzx/QuanX/master/Shadowrocket/Modules/CaiYunAds.sgmodule

# Blackmatrix full Advertising rules (replace AdvertisingLite in troy.conf if desired)
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Shadowrocket/Advertising/Advertising.list
```

## 维护原则

1. **白名单优先**：遇到误杀优先补 DIRECT 例外，而不是永久关闭整套广告规则。
2. **少叠模块**：同一 App 尽量只让一个模块负责改写。
3. **只信任可审计来源**：Module 能读取/修改匹配到的 HTTPS 内容，等同于给脚本很高的网络权限。
4. **证书只留本机**：任何 CA 私钥、p12、passphrase 都不得进入 Git。
