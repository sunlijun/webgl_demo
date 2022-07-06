/**
 * htmlUrl有两种情况：
 * 1. ${URL_CDN}/html/haibao-life/bxtk.html
 *    html文件在路径的第三层
 *    图片src值为：./bxtk-image/1.jpeg
 * 2. ${URL_CDN}/html/cpic-critical-illnesses/clause/index.html
 *    html文件在路径的第四层
 *    图片src值为：./个人重大疾病保险（H2017）条款-01.jpg
 */
const getUrlPrefix = (htmlUrl: any) => {
  const url = new URL(htmlUrl)
  const levels = url.pathname.split('/')

  // 判断html文件在路径的第几层
  const levelIndex = levels[3].includes('.html') ? 3 : 4
  url.pathname = levels.slice(0, levelIndex).join('/')

  return url.toString() + '/'
}

const getHtml = async (url = '') => {
  const res = await fetch(url)
  const html = await res.text()

  return html
}

const getDom = (html: any) => {
  const dom = new DOMParser().parseFromString(html, 'text/html')

  return dom
}

const getString = (node: any) => {
  if (!node) {
    return ''
  }

  const str = node.outerHTML

  return str
}

const getStyleNode = (node: any) => {
  return node.querySelector('style')
}

const getContentNode = (node: any) => {
  return node.querySelector('body > div')
}

const replaceImgSrc = (node: any, url = '') => {
  node.querySelectorAll('img').forEach((img: any) => {
    const src = img.getAttribute('src')
    img.setAttribute('src', src.replace('./', getUrlPrefix(url)))
  })

  return node
}

const getNodes = async (url: string) => {
  if (!url) {
    return ''
  }

  const html = await getHtml(url)
  const dom = getDom(html)
  const contentNode = getContentNode(dom)
  const styleNode = getStyleNode(dom)

  const str = getString(styleNode) + getString(replaceImgSrc(contentNode, url))

  return str
}

export {
  getUrlPrefix,
  getHtml,
  getDom,
  getString,
  getStyleNode,
  getContentNode,
  replaceImgSrc,
  getNodes,
}
