import './css.css'
import "regenerator-runtime/runtime"

const API = 'https://be-prod.redrock.cqupt.edu.cn/another-barrage'

// token 检测
function checkToken() {
  const token = location.href.split('?token=')[1]
  if (token) {
    sessionStorage.setItem('barrage-token', token)
    getRooms() 
  } else {
    var rushbUrl = encodeURI('https://fe-prod.redrock.cqupt.edu.cn/barrage-send/')
    location.href = 'https://be-prod.redrock.cqupt.edu.cn/magicloop-wx/auth/enter/yorozuya?origin=' + rushbUrl + '&scope=student'
  }
}
checkToken()

// 之后的逻辑
const send = document.querySelector('.send')
const input = document.querySelector('.input')
const colorSelector = document.querySelector('#color')
const close = document.querySelector('.close')
const diolog = document.querySelector('.diolog')
const tip = document.querySelector('.tip')
const roomList = document.querySelector("#roomlist")

async function getRooms(){
  let res = await fetch(`${API}/getRooms`);
  let {data} = await res.json();
  try{
    for (const room of data) {
      let newRoom = document.createElement("option");
      newRoom.innerText = room;
      newRoom.value = room;
      roomList.appendChild(newRoom)
    }
    enter(roomList.value)
  }catch(e){
    console.log('没有房间',e)
  }
}

async function enter(value){
  if(value){
    fetch(`${API}/user/enter/${value}`,{
      headers:new Headers({
        'Authorization': `Bearer ${sessionStorage.getItem('barrage-token')}`
      }),
    })
  }
}
roomList.addEventListener('input',enter(roomList.value))

const showTip = err => {
  diolog.style.display = 'block'
  tip.innerText = err
}

send.addEventListener('click', async e => {
  console.log(e)
  const text = input.value
  const color = colorSelector.value

  if (!text) {
    showTip('输入不能为空...')
    return
  }

  try {
    const res = await fetch(`${API}/user/barrage/${roomList.value}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('barrage-token')}`
      }),
      body: JSON.stringify({
        text,
        color,
      }),
    }).then(r => r.json())

    if (res.code === '10000') {
      input.value = ''
      showTip('发送成功')
    } if (res.code === '10012') {
      if (res.msg === 'you send some sensitive') {
        input.value = ''
        showTip('包含敏感词')
      } else {
        input.value = ''
        showTip('休息下再发吧 ^_^')
      }
    }
  } catch (e) {
    input.value = ''
    showTip('网络错误，请重试')
  }
})

close.addEventListener('click', e => {
  diolog.style.display = 'none'
})
