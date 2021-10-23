const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const hsave = localStorage.getItem('hsave')
const hsaveObject = JSON.parse(hsave)
const hashMap = hsaveObject || [{
    logo: 'D',
    url: 'https://developer.mozilla.org/zh-CN/'
  },
  {
    logo: 'G',
    url: 'https://www.google.com/'
  },
]

const simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '') //正则表达式 删除 / 开头的内容
}

const render = () => {
  if (hashMap[1] !== undefined) {
    for (let i = 0; i < hashMap.length - 1; i++) {
      for (let j = i + 1; j < hashMap.length; j++) {
        if (hashMap[i].url === hashMap[j].url) {
          alert('请勿添加相同标签！')
          hashMap.splice(j, 1)
          render()
        }
      }
    }
  }
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    const $li = $(`<li>
    <div class="site" ondragstart="dragStart(event)" draggable="true" ondrop="drop(event)" ondragover="allowDrop(event)">
      <div class="logo">${node.logo}</div>
      <div class="link">${simplifyUrl(node.url)}</div>
      <div class="close">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
      </div>
    </div>
  </li>`).insertBefore($lastLi);
    $li.on('click', () => {
      window.open(node.url)
    })
    $li.on('click', '.close', (e) => {
      e.stopPropagation()
      hashMap.splice(index, 1)
      render()
    })
  })
}
render()

let ecname
let es = {}
let ed = {}
const dragStart = (event) => {
  // console.log(event.target);
  // console.log($(event.path[0]).find('.link')[0].innerHTML);
  ecname = event.path[0].className
  const x = $(event.path[0]).find('.link')[0].innerHTML
  for (let i = 0; i < hashMap.length; i++) {
    // console.log(x,simplifyUrl(hashMap[i].url));
    if (simplifyUrl(hashMap[i].url) === x) {
      es.url = hashMap[i].url
      es.id = i
      // console.log(es);
    }
  }
}
const allowDrop = (event) => {
  event.preventDefault();
}
const drop = (event) => {
  event.preventDefault();
  // console.log(es);
  let temp = {}
  let e
  if (event.path[0].className === ecname) {
    e = event.path[0]
  } else {
    e = event.path[1]
  }
  const x = $(e).find('.link')[0].innerHTML
  // console.log(x);
  for (let i = 0; i < hashMap.length; i++) {
    // console.log(x,simplifyUrl(hashMap[i].url));
    if (simplifyUrl(hashMap[i].url) === x) {
      ed.url = hashMap[i].url
      ed.id = i
    }
  }

  temp.logo = hashMap[ed.id].logo
  temp.url = hashMap[ed.id].url
  hashMap[ed.id].logo = hashMap[es.id].logo
  hashMap[ed.id].url = hashMap[es.id].url
  hashMap[es.id].logo = temp.logo
  hashMap[es.id].url = temp.url
  // console.log(hashMap);
  render()
}

$('.addButton')
  .on('click', () => {
    let url = window.prompt('请问你要添加的网址是什么？')
    // console.log(url);
    if (url.indexOf('http') !== 0) {
      url = 'https://' + url
    }
    // console.log(url);
    hashMap.push({
      logo: simplifyUrl(url)[0].toUpperCase(),
      url: url
    })
    render()
  })

window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap)
  localStorage.setItem('hsave', string)
}

$(document).on('keypress', (e) => {
  const {
    key
  } = e
  if ($('#txt').val() === '') {
    for (let i = 0; i < hashMap.length; i++) {
      if (hashMap[i].logo === key) {
        window.open(hashMap[i].url)
      }
    }
  }
})