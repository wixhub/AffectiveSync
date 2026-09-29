import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { MarkLineOptions } from '../../core/models/affective-sync.models';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  CanvasRenderer,
]);

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

const COMMON_SERIES_PROPERTIES = {
  type: 'line',
  smooth: true,
  showSymbol: true,
  symbol: 'circle',
  symbolSize: 5,
  hoverAnimation: true,
};

export function buildChartSeries(
  data: {
    joy: number[];
    surprise: number[];
    anger: number[];
    sadness: number[];
  },
  markLineOptions?: MarkLineOptions,
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
