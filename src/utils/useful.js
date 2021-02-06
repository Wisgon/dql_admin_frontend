/**
 * 使用indexOf判断元素是否存在于数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
export function isInArray(arr, value) {
  if (arr.indexOf && typeof arr.indexOf == 'function') {
    var index = arr.indexOf(value)
    if (index >= 0) {
      return true
    }
  }
  return false
}
