<template>
  <div ref="chartContainer" :style="{ width: '100%', height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

// Props del componente
const props = defineProps({
  datasets: {
    type: Array,
    required: true,
    default: () => []
  },
  seriesNames: {
    type: Array,
    default: () => []
  },
  height: {
    type: String,
    default: '350px'
  },
  title: {
    type: String,
    default: 'Gráfica de Datos'
  },
  colors: {
    type: Array,
    default: () => ['#fac858', '#5470c6','#91cc75']
  },
  sampling: {
    type: String,
    default: 'lttb'
  },
  // Nueva prop para controlar el formato del eje X
  xAxisType: {
    type: String,
    default: 'auto', // 'auto', 'time-relative', 'index'
    validator: (value) => ['auto', 'time-relative', 'index'].includes(value)
  },
  // Información temporal para cálculos
  timeInfo: {
    type: Object,
    default: () => ({
      startTime: null, // Hora de inicio (opcional)
      duration: 3600, // Duración en segundos (por defecto 1 hora)
      totalPoints: null // Total de puntos (se calcula automáticamente)
    })
  }
})

const chartContainer = ref(null)
let chartInstance = null

// Función para preparar los datos
const prepareChartData = () => {
  if (!props.datasets || props.datasets.length === 0) return { series: [] }
  
  const series = props.datasets.map((dataset, index) => ({
    name: props.seriesNames?.[index] || `Serie ${index + 1}`,
    type: 'line',
    data: dataset, //Datos directos
    large: true,
    sampling: props.sampling,
    symbol: 'none',
    lineStyle: {
      width: 1.5
    },
    color: props.colors[index % props.colors.length]
  }))
  
  return { series }
}

// Función para formatear el eje X según el tipo
const getXAxisConfig = () => {
  const dataLength = props.datasets[0]?.length || 0
  
  switch (props.xAxisType) {
    case 'time-relative':
      // Mostrar tiempo relativo (ej: "0min", "15min", "30min")
      return {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          formatter: (value, index) => {
            const totalMinutes = (props.timeInfo.duration || 3600) / 60
            const minutesPerPoint = totalMinutes / dataLength
            const currentMinutes = Math.round(index * minutesPerPoint)
            
            if (currentMinutes >= 60) {
              const hours = Math.floor(currentMinutes / 60)
              const mins = currentMinutes % 60
              return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
            }
            return `${currentMinutes}m`
          },
          interval: Math.max(1, Math.floor(dataLength / 8)) // Máximo 8 etiquetas
        }
      }
      
    case 'index':
      // Mostrar índices puros (0, 1, 2, 3...)
      return {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          interval: Math.max(1, Math.floor(dataLength / 10)) // Máximo 10 etiquetas
        }
      }
      
    default: // 'auto'
      // ECharts decide automáticamente la mejor representación
      return {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          formatter: (value, index) => {
            // Para datasets grandes, mostrar cada N puntos
            if (dataLength > 100) {
              const step = Math.floor(dataLength / 10)
              return index % step === 0 ? `Punto ${index}` : ''
            }
            // Para datasets pequeños, mostrar todos
            return `${index}`
          }
        }
      }
  }
}

// Función para el tooltip personalizado
const getTooltipFormatter = () => {
  return (params) => {
    const dataIndex = params[0].dataIndex
    const dataLength = props.datasets[0]?.length || 0
    
    let timeInfo = ''
    
    switch (props.xAxisType) {
      case 'time-relative':
        const totalMinutes = (props.timeInfo.duration || 3600) / 60
        const minutesPerPoint = totalMinutes / dataLength
        const currentMinutes = Math.round(dataIndex * minutesPerPoint)
        timeInfo = `<strong>Tiempo: ${currentMinutes} minutos</strong><br/>`
        break
        
      case 'index':
        timeInfo = `<strong>Punto: ${dataIndex}</strong><br/>`
        break
        
      default:
        // Calcular tiempo aproximado si tenemos info temporal
        if (props.timeInfo.startTime) {
          const startTime = new Date(props.timeInfo.startTime)
          const pointInterval = (props.timeInfo.duration * 1000) / dataLength
          const currentTime = new Date(startTime.getTime() + (dataIndex * pointInterval))
          timeInfo = `<strong>${currentTime.toLocaleTimeString()}</strong><br/>`
        } else {
          timeInfo = `<strong>Muestra: ${dataIndex + 1} de ${dataLength}</strong><br/>`
        }
    }
    
    let tooltip = timeInfo
    params.forEach(param => {
      tooltip += `${param.seriesName}: ${param.value}<br/>`
    })
    return tooltip
  }
}

// Configuración del gráfico
const getChartOption = () => {
  const { series } = prepareChartData()
  
  return {
    title: {
      text: props.title,
      left: 'center',
      textStyle: {
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: getTooltipFormatter()
    },
    legend: {
      data: series.map(s => s.name),
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: getXAxisConfig(),
    yAxis: {
      type: 'value',
      scale: true
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        height: 30
      }
    ],
    series
  }
}

// Inicializar el gráfico
const initChart = async () => {
  await nextTick()
  if (!chartContainer.value) return
  
  chartInstance = echarts.init(chartContainer.value)
  chartInstance.setOption(getChartOption())
  
  window.addEventListener('resize', handleResize)
}

// Actualizar el gráfico
const updateChart = () => {
  if (chartInstance) {
    chartInstance.setOption(getChartOption(), true)
  }
}

// Manejo de resize
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// Watchers
watch(() => props.datasets, updateChart, { deep: true })
watch(() => props.xAxisType, updateChart)
watch(() => props.title, updateChart)

// Lifecycle hooks
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>