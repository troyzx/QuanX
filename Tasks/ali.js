const $ = new compatibility();
const energy =
    // "alipays://platformapi/startapp?appId=10000009&url=/www/stepDonate.htm?chInfo=antsports&sourceName=antsports";
    "alipay://platformapi/startapp?appId=60000002"

$.notify("支付宝", "", "收能量啦", energy);

$done();

function compatibility() {
    _isQuanX = typeof $task != "undefined";
    _isLoon = typeof $loon != "undefined";
    _isSurge = typeof $httpClient != "undefined" && !_isLoon;
    this.read = (key) => {
        if (_isQuanX) return $prefs.valueForKey(key);
        if (_isLoon) return $persistentStore.read(key);
    };
    this.notify = (title, subtitle, message, url) => {
        if (_isLoon) $notification.post(title, subtitle, message, url);
        if (_isQuanX) $notify(title, subtitle, message, { "open-url": url });
        if (_isSurge) $notification.post(title, subtitle, message, { url: url });
    };
}