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
  $siteList.find('li:not(.last)').remove()
  hashMap.forEach((node, index) => {
    const $li = $(`<li>
    <div class="site">
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
  const { key } = e
  if ($('#txt').val() === '') {
    for (let i = 0; i < hashMap.length; i++) {
      if (hashMap[i].logo === key) {
        window.open(hashMap[i].url)
      }
    }
  }
})