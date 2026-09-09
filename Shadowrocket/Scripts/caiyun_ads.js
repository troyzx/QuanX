/***********************************************
> 应用名称：彩云天气净化（Shadowrocket 去广告版）
> 原始脚本：@ddgksf2013 / 墨鱼手记
> 原始版本：V1.0.8（2024-09-01）
> 适配说明：仅保留广告、活动与推广内容净化逻辑；不包含会员/VIP权限修改。
***********************************************/

const url = $request.url;

function parseBody() {
  try {
    return JSON.parse($response.body || "{}");
  } catch (error) {
    console.log(`[CaiYunAds] JSON parse failed: ${error}`);
    return null;
  }
}

try {
  let result;

  if (url.includes("/activity")) {
    result = url.includes("type_id=A03")
      ? { status: "ok", activities: [{ type: "tabbar", name: "aichat", feature: false }] }
      : { status: "ok", activities: [{ items: [{}] }] };
  } else if (url.includes("operation/homefeatures")) {
    result = { data: [] };
  } else if (url.includes("operation/feeds")) {
    const body = parseBody();
    if (!body) $done({});
    if (Array.isArray(body.data)) {
      body.data = body.data.filter(
        (item) => typeof item?.category_times_text === "string" && item.category_times_text.includes("人查看")
      );
    }
    result = body;
  } else if (url.includes("operation/banners")) {
    result = {
      data: [
        {
          avatar: "https://cdn-w.caiyunapp.com/p/app/operation/prod/banner/668502d5c3a2362582a2a5da/d9f198473e7f387d13ea892719959ddb.jpg",
          url: "https://cdn-w.caiyunapp.com/p/app/operation/prod/article/66850143c3a2362582a2a5d9/index.html",
          title: "暴雨来袭，这些避险“秘籍”你学会了吗？",
          banner_type: "article"
        }
      ]
    };
  } else if (url.includes("operation/features")) {
    const body = parseBody();
    if (!body) $done({});
    if (Array.isArray(body.data)) {
      body.data = body.data.filter((item) => typeof item?.url === "string" && item.url.includes("cy://"));
    }
    result = body;
  } else if (url.includes("/campaigns")) {
    result = {
      campaigns: [
        {
          name: "driveweather",
          title: "驾驶天气新功能",
          url: "cy://page_driving_weather",
          cover: "https://cdn-w.caiyunapp.com/p/banner/test/668d442c4fe75aca7251c161.png"
        }
      ]
    };
  } else if (url.includes("notification/message_center")) {
    result = { messages: [] };
  } else if (url.includes("config/cypage")) {
    result = { popups: [], actions: [] };
  } else {
    $done({});
  }

  $done({ body: JSON.stringify(result) });
} catch (error) {
  console.log(`[CaiYunAds] unexpected error: ${error}`);
  $done({});
}
