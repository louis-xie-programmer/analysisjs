//发送事件日志
function sendToAnalytics(metric) {
  send('https://analysis.laiys.com/api/v1/event/analytics/laiys',metric)
}

//发送
function send(api,metric){
  const body = JSON.stringify(metric);
  (navigator.sendBeacon && navigator.sendBeacon(api, body)) ||
    fetch(api, {method: 'POST', keepalive: true});
}

//设置uuid(设备id)
function setuuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  var uuid = s.join("");
  return uuid;
}

//创建页面唯一标识并保存到页面
const piddom = document.createElement('script')
piddom.type = "text/x-app-data"
piddom.id = "analysis-pid" 
piddom.innerText = setuuid() // 单次浏览标识
document.body.appendChild(piddom)

//离开页面时发送viewtime事件
window.onunload = () => {
  const i = document.getElementById("analysis-pid").innerText
  const u = document.URL
  sendToAnalytics({i,u,e:"viewtime"})
}
