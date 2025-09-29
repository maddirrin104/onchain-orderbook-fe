export const fmt = {
  num(n?: number | string, d = 4){
    if(n === undefined || n === null) return '-'
    const x = typeof n === 'string' ? parseFloat(n) : n
    return Intl.NumberFormat('en-US', { maximumFractionDigits: d }).format(x)
  },
}