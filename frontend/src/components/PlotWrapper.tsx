// react-plotly.js is CJS-only. Vite's ESM interop sometimes wraps
// module.exports in { default: ... }. This unwraps it safely.
import PlotComponent from 'react-plotly.js'
const Plot: typeof PlotComponent = (PlotComponent as any).default ?? PlotComponent
export default Plot
