//发送pageview日志
function sendToEventLog(metric) {
  send('pageview/laiys', metric);
}
function sendToAnalytics(metric) {
  send('event/analytics/laiys', metric);
}

//发送
function send(api, metric) {
  const body = JSON.stringify(metric);
  if(document.URL.startsWith("https://www.laiys.com")){
    api = "https://analysis.laiys.com/api/v1/" + api
  }else{
    api = "https://localanalysis.laiys.com/api/v1/" + api
  }
  
  (navigator.sendBeacon && navigator.sendBeacon(api, body)) ||
    xhrsend(api,body);
}

function xhrsend(api,body){
  const xhr = createXHR()
  xhr.open(method = 'POST', url = api, async = false)
  xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
  xhr.send(body)
}

function createXHR() {
  // 兼容不同浏览器和版本得到创建函数数组
  var XHR = [
      () => new XMLHttpRequest(),
      () => new ActiveXObject('Msxml2.XMLHTTP'),
      () => new ActiveXObject('Msxml3.XMLHTTP'),
      () => new ActiveXObject('Microsoft.XMLHTTP')
  ]
  var xhr = null
  // 尝试调用函数，如果成功则返回XHR对象，否则继续尝试
  for (let i = 0; i < XHR.length; i++) {
      try {
          xhr = XHR[i]()
          // 如果成功，则终止循环
          break
      } catch (e) {
          // 如果发生异常,则继续下一个函数调用
          continue
      }
  }
  return xhr
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

//获取屏幕缩放比例
function getRatio() {
  var ratio = 0;
  var screen = window.screen;
  var ua = navigator.userAgent.toLowerCase();
  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio;
  }
  else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI;
    }
  }
  else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth;
  }
  if (ratio) {
    ratio = Math.round(ratio * 100);
  }
  return ratio;
}

let piddom = document.getElementById("analysis-pid")

if (piddom == null) {
  //创建页面唯一标识并保存到页面
  piddom = document.createElement('script')
  piddom.type = "text/x-app-data"
  piddom.id = "analysis-pid"
  piddom.innerText = setuuid() + ',200'
  document.body.appendChild(piddom)
}

// 发送pageview记录到接口(处理渠道来源，referrer(包含来源渠道), 页面浏览类型（正常访问，刷新访问，后退，前进）,title)
const i = piddom.innerText.split(',')[0]// 浏览标识
const s = parseInt(piddom.innerText.split(',')[1])// 状态码
const u = window.location.href  // 当前链接地址
const r = window.document.referrer  // 上一个页面
const v = window.performance.navigation.type.toString()  //当前浏览的方式：0：normal；1：reload; 2:back; 255: other
const t = window.document.title   //页面标题
const p = window.performance.getEntries()[0].nextHopProtocol //http 版本
const w = navigator.webdriver ?? false //ua是否修改过

//uuid(机器码,随机guid存储在localStorage)
let m = localStorage.getItem("mid") || ""

if (m == "") {
  m = setuuid()
  localStorage.setItem("mid", m);
}

//屏幕像素
const sc = window.screen.height * getRatio() / 100 + "px * " + window.screen.width * getRatio() / 100 + "px";

//navigator数据
sendToEventLog({ i, s, u, r, v, t, p, w, m, sc })

let ishidesend = 0;

var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

document.addEventListener(visibilityChange, function(){
  if(ishidesend>2){
    return
  }
  if (document[hidden]) {
    ishidesend ++
    sendToAnalytics({ i, u, e: "hidetime" })
  }else {
    sendToAnalytics({ i, u, e: "showtime" })
  }
})

window.onbeforeunload = () => {
  console.log("onbeforeunload done")
  debugger
  sendToAnalytics({ i, u, e: "closetime" })
}

//#region  基于业务的处理：搜索页产品曝光率, 点击率
const watchurls = []

const intersectionObserver = new IntersectionObserver(function(entries) {
  try {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        //可见
        const {target} = entry
        const u = target.getAttribute('href')
        const t = target.getAttribute('title')

        const w = target.getAttribute('wid')

        if(u && !w){
          //将坐标发送到服务端
          const bx = document.body.scrollLeft
          const by = document.body.scrollTop
          const ex = element.getBoundingClientRect().left
          const ey = element.getBoundingClientRect().top

          const wid = setuuid();
          //标记已经曝光记录
          target.setAttribute('wid', wid)

          watchurls.push({ wid, u, t, bx, by, ex, ey })
          console.log("intersectionObserver: ", { u, t, bx, by, ex, ey })
          //添加click监听
          target.addEventListener("click", function () {
            //提交点击数据
            const cwid = entry.target.getAttribute('wid')
            const cc = { wid: cwid, u: target.getAttribute('href') }
            sendToAnalytics({ i, u, e: "click", c: JSON.stringify(cc) });
          })

          intersectionObserver.unobserve(entry)
        }
      }
    })
  } catch {

  }
},{
  threshold: 1.0, // 可视达到100%则为曝光
});

// 开始曝光监控.search-data-list .search-data-desc 注意排除描点标签加上[href]
document.querySelectorAll('.needwatch a[href]').forEach((item)=>{
  try{
    intersectionObserver.observe(item);
  }catch{
  }
})
// 发送曝光数据
const sendwatchdb = async () => {
  const db = []
  for(var i=0; i< 20; i++ ){
    db.push(watchurls.shift())
    if(watchurls.length < 1) break;
  }
  console.log("sendwatchdb :" , db, Date.now())
  sendToAnalytics({ i, u, e: "exposed", c: JSON.stringify(db)});
  return true;
};

try {
  //设置定时器，发送
  setInterval(async () => {
    if(watchurls.length>0){
      await sendwatchdb()
    }
  }, 500);
} catch (e) {
  console.log(e)
}