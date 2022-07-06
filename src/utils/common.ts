// qlog 开发环境有效
function qlog(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    const ql = console.log
    ql.apply(console, args)
  }
}

export { qlog }
