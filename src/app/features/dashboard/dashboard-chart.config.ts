import { EChartsOption } from 'echarts';

/**
 * Base configuration options for the ECharts Timeline
 */
export const BASE_CHART_CONFIG: Partial<EChartsOption> = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' },
  },
  legend: {
    data: ['Joy', 'Surprise', 'Anger', 'Sadness'],
    textStyle: { color: '#94a3b8' },
    top: '2%',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '8%',
    top: '15%',
    containLabel: true,
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 1,
    axisLine: { lineStyle: { color: '#475569' } },
    splitLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8' },
  },
};

/**
 * Default style properties applied to each line series
 */
const COMMON_SERIES_PROPERTIES = {
  type: 'line',
  smooth: true,
  showSymbol: true,
  symbol: 'circle',
  symbolSize: 5,
  hoverAnimation: true,
};

/**
 * Generates structured series list mapped to dynamic data
 */
export function buildChartSeries(
  data: {
    joy: number[];
    surprise: number[];
    anger: number[];
    sadness: number[];
  },
  markLineOptions?: any,
) {
  return [
    {
      ...COMMON_SERIES_PROPERTIES,
      name: 'Joy',
      data: data.joy,
      itemStyle: { color: '#10b981' },
      markLine: markLineOptions,
    },
    {
      ...COMMON_SERIES_PROPERTIES,
      name: 'Surprise',
      data: data.surprise,
      itemStyle: { color: '#f59e0b' },
    },
    {
      ...COMMON_SERIES_PROPERTIES,
      name: 'Anger',
      data: data.anger,
      itemStyle: { color: '#ef4444' },
    },
    {
      ...COMMON_SERIES_PROPERTIES,
      name: 'Sadness',
      data: data.sadness,
      itemStyle: { color: '#3b82f6' },
    },
  ];
}
