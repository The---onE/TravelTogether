function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 判断字符串是否非空，非空则抛出异常
function getInputNotEmpty(str, emptyPrompt) {
  var res = str.replace(/(^s)(s$)/g, "")
  if (res.length > 0) {
    return res;
  } else {
    throw emptyPrompt;
  }
}

module.exports = {
  formatTime: formatTime,
  getInputNotEmpty: getInputNotEmpty
}
