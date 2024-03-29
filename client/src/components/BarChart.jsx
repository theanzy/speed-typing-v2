import { useCallback, useState } from 'react';
import { Chart, registerables } from 'chart.js';

function BarChart({ labels, data }) {
  Chart.defaults.color = 'hsl(201, 100%, 70%)';
  const CONFIG = {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'WPM',
          data: data,
          backgroundColor: 'rgba(0, 200, 0, 0.3)',
          borderColor: 'rgba(55, 200, 55, 1)',
          borderRadius: 5,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: { 
          display: true,
          text: 'Last 10 Scores',
          font: {
            weight: 'bold',
            size: 15,
            lineHeight: 1,
          },
          padding: 5
        },
      },
    },
  };
  const [chart, setChart] = useState(null);
  const chartRef = useCallback((chartElem) => {
    if (chartElem == null) {
      return;
    }
    const ctx = chartElem.getContext('2d');
    Chart.register(...registerables);
    if (chart != null) {
      chart.destroy();
    }
    setChart(new Chart(ctx, CONFIG));
  }, []);
  return <canvas ref={chartRef}></canvas>;
}

export default BarChart;
