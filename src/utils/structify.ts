// import { isDefObj, copy } from '@utils/utils'
import { deepClone } from './tool'
const cache = {
  get(key: string) {
    return this[key]
  },
  set(key: string, value: any) {
    this[key] = value
  },
}

/**
 * 获取 MultiPicker 的数据结构
 * @param {object} config
 * @param {string} pickerKey
 * @param {string} searchKey
 * @param {string} searchValue
 */
function init(config = {}, pickerKey = '', searchKey = '', searchValue: any) {
  const { originItems, childrenKey = 'items', deep } = config

  let originIndexs = []
  let defItems = []
  if (searchValue) {
    /* 拍平的数据 + 缓存 */
    let flatedItems = cache[pickerKey]
    if (!flatedItems) {
      /* 原始数据不宜直接处理, 容易产生副作用, 如 添加 parent 属性后, JSON.parse(JSON.stringify())时会报错 */
      flatedItems = cache[pickerKey] = deepClone(originItems)
        .map((item, i) => deepTraversal(item, i, null, childrenKey))
        .flat()
    }

    /* (拍平数据的数组中)查找 索引和项目 */
    const index = flatedItems.findIndex((item) => item[searchKey] == searchValue)
    if (index >= 0) {
      const lastItem = flatedItems[index]
      ;[defItems, originIndexs] = combineUpper(lastItem, deep, childrenKey)
      // console.log("* up", defItems, originIndexs);
    }
  }

  return {
    ...config,
    originIndexs /* 当前显示元素的索引 */,
    items: defItems,
  }
}

/**
 * 深度遍历, 关联父子元素
 * @param {object} node  单项
 * @param {number} selfIndex 当前node的索引
 * @param {object} parentNode 当前node的父元素
 * @param {string} childrenKey 子元素组的属性
 */
function deepTraversal(node: any, selfIndex = 0, parentNode: any, childrenKey: string) {
  let list = []

  if (Object.prototype.toString.call(node) === '[object Object]') {
    const { [childrenKey]: items = [] } = node
    list.push(Object.assign(node, { parent: parentNode, selfIndex }))

    items.forEach((item, i) => {
      list = list.concat(deepTraversal(item, i, node, childrenKey))
    })
  }
  return list
}

/**
 * 从深层往浅层查找并返回索引和项数;
 * @param {object} item
 * @param {number} deep 层次值
 */
function combineUpper(item: any, deep: number, childrenKey = 'items') {
  if (deep >= 1) {
    /* 添加 parent / [childrenKey] 等属性后, 返回的结果不宜有这两项内容 */
    const { parent, selfIndex, ...others } = item
    // console.log('* item', item)
    const parentRes = combineUpper(parent, deep - 1, childrenKey)
    return [
      [...parentRes[0], { ...others, selfIndex }],
      [...parentRes[1], selfIndex],
    ]
  } else {
    return [[], []]
  }
}

export default init
