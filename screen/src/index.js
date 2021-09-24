import './css.css'

class Barrage {
  constructor(canvas) {
    this.canvas = document.querySelector(canvas)
    const height = document.documentElement.clientHeight
    const width = document.documentElement.clientWidth
    this.canvas.height = height
    this.canvas.width = width

    const rect = this.canvas.getBoundingClientRect();
    this.w = rect.right - rect.left;
    this.h = rect.bottom - rect.top;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = '50px Microsoft YaHei';
    this.barrageList = [];
  }

  //添加弹幕列表
  shoot({ text, color }) {
    let top = this.getTop();
    let offset = this.getOffset();
    let width = Math.ceil(this.ctx.measureText(text).width);
    let barrage = {
      value: text,
      top,
      left: this.w,
      color,
      offset,
      width,
    }
    this.barrageList.push(barrage);
  }

  //开始绘制
  draw() {
    if (this.barrageList.length) {
      this.ctx.clearRect(0, 0, this.w, this.h);
      for (let i = 0; i < this.barrageList.length; i++) {
        let b = this.barrageList[i];
        if (b.left + b.width <= 0) {
          this.barrageList.splice(i, 1);
          i--;
          continue;
        }
        b.left -= b.offset;
        this.drawText(b);
      }
    }
    requestAnimationFrame(this.draw.bind(this));
  }

  //绘制文字
  drawText(barrage) {
    this.ctx.fillStyle = barrage.color;
    this.ctx.fillText(barrage.value, barrage.left, barrage.top);
  }

  //获取随机top
  getTop() {
    //canvas绘制文字x,y坐标是按文字左下角计算，预留30px
    return Math.floor(Math.random() * (this.h - 50)) + 50;
  }

  //获取偏移量
  getOffset() {
    return +(Math.random() * 2).toFixed(1) + 2;
  }
}

let barrage = new Barrage('canvas')
barrage.draw()

const lucky = document.querySelector('.lucky')
const luckyWrapper = document.querySelector('.lucky-wrapper')

window.addEventListener('click', e => {
  if (e.target.className === 'screen') {
    lucky.style.display = 'none'
    luckyWrapper.innerHTML = ''
  }
})

const TIMEOUTTIME = 5000
const INTERVALTIME = 100

const fakeBadUsernames = [
  'ahabhgk',
  'sajo',
  'sudo rm -rf /*',
  '仰望',
  '锅',
  '孤雏',
  'Nickdue',
  'ShallowDream',
  '复读机',
  '封瑟',
  'Ryan',
  '青山',
  '瞳根',
  '还原型辅酶Ⅱ',
  '风华学月wsm',
  '℡★魅G↘纷飛',
  '枉久',
  'Neko',
  'Deep memory',
  'flower',
  '黑白先生',
  'Huayra的轮胎',
  'Isolation',
  '霜天に坐せ',
  '君爱卿',
  'Kirito',
  'Kennard',
  'lyna tlncgbnn',
  'Los Unidades',
  'Phosphorite',
  '青笙挽歌',
  '柒千零四十五',
  '浅夏_流年',
  '前世迟来者.',
  '逝风而去',
  'Even You',
]

function shuffle(arr) {
  var input = [...arr];

  for (var i = input.length-1; i >=0; i--) {
    var randomIndex = Math.floor(Math.random()*(i+1));
    var itemAtIndex = input[randomIndex];

    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}

const showLucky = (luckyUsers, badUsernames = shuffle(fakeBadUsernames)) => {
  console.log(luckyUsers)
  luckyWrapper.innerHTML = luckyUsers.map(() => `
    <div class="lucky-info">
      <div class="avatar">?</div>
      <div class="name"> </div>
    </div>
  `).join('')

  lucky.style.display = 'block'

  const names = Array.from(document.querySelectorAll('.name'))
  const interval = setInterval(() => {
    names.map(name => {
      name.innerText = badUsernames[Math.floor(Math.random() * badUsernames.length)]
    })
  }, INTERVALTIME)

  const timeout = setTimeout(() => {
    luckyWrapper.innerHTML = luckyUsers.map(({ headImgUrl, nickname }) => `
      <div class="lucky-info">
        <div class="avatar" style="background-image: url(${headImgUrl})"></div>
        <div class="name">${nickname}</div>
      </div>
    `).join('')

    clearInterval(interval)
    clearTimeout(timeout)
  }, TIMEOUTTIME)
}

const ws = new WebSocket('wss://be-prod.redrock.cqupt.edu.cn/another_barrage/screen/barrage')

ws.onopen = e => {
  console.log("Connection open ...")
  ws.send("Hello WebSockets!")

  setInterval(() => {
    ws.send('keepOnline')
    console.log('keepOnline')
  }, 29000)
}

ws.onmessage = e => {
  const t = JSON.parse(e.data)

  if (!t.status) {
    console.log(t)
    barrage.shoot(t)
    return
  }

  showLucky(t.data)
}

ws.onclose = e => console.log("Connection closed.")
