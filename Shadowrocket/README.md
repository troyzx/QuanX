# Troy's Shadowrocket Config

这是一份从个人 Quantumult X 配置迁移来的 **Shadowrocket 自用配置**，重点是：

- Shadowrocket 内置 **Tailscale 全局隧道**常驻，避免 iOS 同时只能保持一个 VPN 的冲突；
- 保留原 QuanX 的地区节点组、Fortnite、GeForce NOW、Home、Apple、Bilibili、国际媒体、OpenAI、Speedtest 等分流习惯；
- 默认启用 **AdvertisingLite** 域名/IP 广告规则；
- 开屏广告和国产 App 内广告通过 Shadowrocket Module + HTTPS 解密增强；
- 仓库内 **不保存** 节点订阅、Tailscale Auth Key、MITM 证书、证书密码或其他 token。

## 1. 导入主配置

Shadowrocket → 配置 → `+` → 下载：

```text
https://raw.githubusercontent.com/troyzx/QuanX/master/Shadowrocket/troy.conf
```

节点/机场订阅请在 Shadowrocket 里单独添加。主配置中的地区测速组通过节点名称正则自动匹配，不需要把订阅 URL 写进 GitHub。

## 2. Tailscale 常驻

Shadowrocket 2.2.89 (3314) 起内置 Tailscale 全局隧道模块。

在 Shadowrocket：

1. 设置 → Tailscale → 启用；
2. 填入自己的 Tailscale Auth Key（只保存在手机本机）；
3. 默认控制服务器保持 Tailscale 官方地址即可；
4. 确认 `TUN 旁路路由 / tun-excluded-routes` **没有** `100.64.0.0/10`；
5. 主配置已经把 `100.64.0.0/10`、`*.ts.net` 和 MagicDNS `100.100.100.100` 交给 `TAILSCALE` 策略。

> 你旧 QuanX 里的 `100.64.0.0/10 -> Home` 已有意改为 `TAILSCALE`，这是这次迁移最重要的行为变化。

## 3. 去广告：默认层

`troy.conf` 默认加载：

```text
AdvertisingLite -> 🛑 广告拦截 -> REJECT
```

它覆盖大量国内 App 的广告域名、广告 SDK、统计/推广域名，同时比完整 Advertising 规则更适合手机长期常驻。

遇到某个 App 被误杀时，不用删规则：进入策略组，把 `🛑 广告拦截` 临时从 `REJECT` 切成 `DIRECT` 即可快速确认是不是广告规则造成的。

## 4. 去广告：开屏 / App 内增强

仅靠域名 REJECT 无法处理所有开屏广告，因为很多 App 的广告和正常内容共用接口。需要脚本修改 HTTP(S) 响应。

### 推荐先启用：Blackmatrix AdvertisingScript

Module URL：

```text
https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rewrite/Shadowrocket/AdvertisingScript/AdvertisingScript.sgmodule
```

它包含若干开屏广告处理（如 Bilibili、京东、爱奇艺、美团外卖等）以及知乎净化规则。

### 更激进：fmz200 blockAds

如果你更在意国产 App 广告覆盖率，可以**改用**：

```text
https://raw.githubusercontent.com/fmz200/wool_scripts/main/Shadowrocket/module/blockAds.srmodule
```

这是体积更大的综合去广告模块。建议一开始不要和 AdvertisingScript 全量叠加，先二选一；否则规则重复、MITM 域名增多，也更难定位误杀。

可选的微博专项模块：

```text
https://raw.githubusercontent.com/fmz200/wool_scripts/main/Shadowrocket/module/weibo.srmodule
```

更多取舍见 [MODULES.md](./MODULES.md)。

## 5. HTTPS 解密 / MITM

需要脚本型去广告模块时：

1. 在 Shadowrocket 中开启 HTTPS 解密；
2. **重新生成 Shadowrocket 自己的 CA 证书**；
3. iOS 安装描述文件后，在“设置 → 通用 → 关于本机 → 证书信任设置”中信任该根证书；
4. 不要把证书、p12、密码提交到 GitHub。

本仓库**不会复用或上传旧 QuanX 配置中的 MITM p12 和 passphrase**。节点订阅和 Tailscale Auth Key 同样只保留在本机。

## 6. 为什么没有把 QuanX 所有 Rewrite 原样搬过来

原配置同时包含“去广告/体验优化”和“VIP/付费功能解锁”类脚本。这次迁移只保留你的核心诉求：**分流、Tailscale、去广告、开屏净化**。

以下类型默认不迁移：

- Spotify / Emby / 彩云等会员或付费功能解锁；
- BuyiTunes、专属 VIP 等账户/权益修改；
- 旧 QuanX MITM 证书；
- 私有节点和订阅 URL。

这样更稳定，也避免为了广告过滤引入不必要的账户风险和维护负担。

## 7. 常见问题

### App 还是有开屏广告

先完全杀掉 App 再打开；部分 App 会把开屏素材缓存到本地，启用规则后可能还要清缓存，极端情况下需要卸载重装。TLS Pinning、QUIC、端内渲染或与业务接口完全混合的广告，也可能无法可靠过滤。

### 开启模块后 App 白屏 / 登录失败

先把 `🛑 广告拦截` 切到 `DIRECT`。如果问题仍在，再逐个停用 Module；这样可以区分是域名规则误杀还是 MITM/脚本造成。

### Tailscale 节点不通

首先检查 `tun-excluded-routes` 是否又被 App 或其他配置写回了 `100.64.0.0/10`。然后确认 Shadowrocket 的 Tailscale 模块处于已连接状态，而不是同时启动独立 Tailscale VPN。
