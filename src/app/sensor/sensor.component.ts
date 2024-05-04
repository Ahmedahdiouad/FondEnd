import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as echarts from 'echarts';
import { SensorwebsocketService } from '../services/sensorwebsocket.service';


enum ValidChartTypes {
  Bar = 'bar',
  Line = 'line',
  Pie = 'pie',
  Radar = 'radar',
  Bubble = 'bubble'
  // Add more chart types as needed
}

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.scss']
})
export class SensorComponent implements OnInit {
  // shared value between sensors :
  TodayDate!: any;

  // Define data arrays for temperature
  dataTemperature: number[] = [];
  timeLabelsTemperature : any[] = [];

  // Define data arrays for humidity
  dataHumidity: number[] = [];
  timeLabelsHumidity : any[] = [];
 
  // Define data arrays for flow
  dataFlow : number[] = [];
  timeLabelsFlow : any[] = [];

  // Define data arrays for position
  dataPosition : number[] = [];
  timeLabelsPosition : any[] = [];

  // Define data arrays for paintLevel
  dataPaintLevel : number[] = [];
  timeLabelsPaintLevel : any[] = [];

  // Define data arrays for surfaceQuality
  dataSurfaceQuality : any[] = [];
  timeLabelsSurfaceQuality : any[] = [];
  
  
  
  constructor(private sensorWebSocket: SensorwebsocketService) {}

  ngOnInit(): void {

    // Subscribe to real-time data from WebSocket service
    this.sensorWebSocket.getRealTimeData().subscribe((data: any) => {
      console.log("Data received:", data);
    // Iterate over each object in the array
    data.forEach((item: any) => {
        // Access the properties of each object
        // Update data arrays for all charts
        if(item.SensorID == 'Type-2'){
          this.dataTemperature.push(item.Value);
          this.timeLabelsTemperature.push(new Date(item.Date_n_Time).toLocaleTimeString());
          this.TodayDate = new Date(item.Date_n_Time).toLocaleDateString();
        }
        if(item.SensorID == 'Type-1'){
          this.dataHumidity.push(item.Value);
          this.timeLabelsHumidity.push(new Date(item.Date_n_Time).toLocaleTimeString());
        }
        if(item.SensorID == 'Type-3'){
          this.dataFlow.push(item.Value);
          this.timeLabelsFlow.push(new Date(item.Date_n_Time).toLocaleTimeString());
        }
        if(item.SensorID == 'Type-4'){
          this.dataPosition.push(item.Value);
          this.timeLabelsPosition.push(new Date(item.Date_n_Time).toLocaleTimeString());
        }
        if(item.SensorID == 'Type-5'){
          this.dataPaintLevel.push(item.Value);
          this.timeLabelsPaintLevel.push(new Date(item.Date_n_Time).toLocaleTimeString());
        }
        if(item.SensorID == 'Type-6'){
          this.dataSurfaceQuality.push(item.Value);
          this.timeLabelsSurfaceQuality.push(new Date(item.Date_n_Time).toLocaleTimeString());
        }
    });

      // chart.js
      this.createOrUpdateChartForTemperature('chart2', ValidChartTypes.Line, this.timeLabelsTemperature, this.dataTemperature);
      this.createOrUpdateChartForflow('chart4', ValidChartTypes.Line, this.timeLabelsFlow, this.dataFlow);
      this.createOrUpdateChartForPaintLevel('chartPaintLevel', ValidChartTypes.Line, this.timeLabelsPaintLevel, this.dataPaintLevel);
      this.createOrUpdateChartForHumidity('chartHumidity', ValidChartTypes.Line, this.timeLabelsHumidity, this.dataHumidity);
      this.createOrUpdateChartForSurfaceQuality('chartQuality', ValidChartTypes.Bar, this.timeLabelsSurfaceQuality, this.dataSurfaceQuality);
      this.createOrUpdateChartForPosition('chartPosition', ValidChartTypes.Bar, this.timeLabelsPosition, this.dataPosition);

      // E-charts
      this.renderChartCompareHumidityAndTemperature(this.dataTemperature,this.timeLabelsTemperature,this.dataHumidity);
      this.renderChartCompareFlowAndPaintLevel(this.dataFlow,this.timeLabelsFlow,this.dataPaintLevel);
      this.renderChartHumidity();
    });
  }

  createOrUpdateChartForPosition(elementId: string, type: ValidChartTypes, labels: string[], dataPosition: number[]): void {
    const canvas = document.getElementById(elementId);

    // Check if canvas is an HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error(`Element with ID '${elementId}' is not a canvas.`);
      return;
    }

    const ctx = canvas.getContext('2d');

    // Perform a null check on ctx
    if (!ctx) {
      console.error(`Context not available for canvas with ID '${elementId}'.`);
      return;
    }

    // Check if chart already exists
    let chart = Chart.getChart(ctx);
    if (chart) {
      // If chart exists, update its data
      chart.data.labels = labels.slice(-5); // Get the labels corresponding to the latest five data points
      chart.data.datasets[0].data = dataPosition.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Position',
            data: dataPosition.slice(-5),
            borderColor: 'rgb(100, 50, 100)',
            backgroundColor: 'rgb(100, 50, 100)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x : {
              grid : {
                drawOnChartArea : false
              },
            },
            y: {
              grid : {
                drawOnChartArea : false
              },
              beginAtZero: true
            }
          },
        },
      });
    }
  }

  createOrUpdateChartForSurfaceQuality(elementId: string, type: ValidChartTypes, labels: string[], dataQuality: number[]): void {
    const canvas = document.getElementById(elementId);

    // Check if canvas is an HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error(`Element with ID '${elementId}' is not a canvas.`);
      return;
    }

    const ctx = canvas.getContext('2d');

    // Perform a null check on ctx
    if (!ctx) {
      console.error(`Context not available for canvas with ID '${elementId}'.`);
      return;
    }

    // Check if chart already exists
    let chart = Chart.getChart(ctx);
    if (chart) {
      // If chart exists, update its data
      chart.data.labels = labels.slice(-5); // Get the labels corresponding to the latest five data points
      chart.data.datasets[0].data = dataQuality.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Surface Quality',
            data: dataQuality.slice(-5)
          }]
        },
        options: {
          scales: {
            x : {
              grid : {
                drawOnChartArea : false
              },
            },
            y: {
              grid : {
                drawOnChartArea : false
              },
              beginAtZero: true
            }
          },
        }
      });
    }
  }

  createOrUpdateChartForHumidity(elementId: string, type: ValidChartTypes, labels: string[], dataHumidity: number[]): void {
    const canvas = document.getElementById(elementId);

    // Check if canvas is an HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error(`Element with ID '${elementId}' is not a canvas.`);
      return;
    }

    const ctx = canvas.getContext('2d');

    // Perform a null check on ctx
    if (!ctx) {
      console.error(`Context not available for canvas with ID '${elementId}'.`);
      return;
    }

    // Check if chart already exists
    let chart = Chart.getChart(ctx);
    if (chart) {
      // If chart exists, update its data
      chart.data.labels = labels.slice(-5); // Get the labels corresponding to the latest five data points
      chart.data.datasets[0].data = dataHumidity.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Humidity',
            data: dataHumidity.slice(-5),
            borderColor: 'rgb(0, 0, 255)',
            backgroundColor: 'rgb(0, 0, 255)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x : {
              grid : {
                drawOnChartArea : false
              },
            },
            y: {
              grid : {
                drawOnChartArea : false
              },
              beginAtZero: true
            }
          },
        },
      });
    }
  }

  createOrUpdateChartForPaintLevel(elementId: string, type: ValidChartTypes, labels: string[], dataPaintLevel: number[]): void {
    const canvas = document.getElementById(elementId);

    // Check if canvas is an HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error(`Element with ID '${elementId}' is not a canvas.`);
      return;
    }

    const ctx = canvas.getContext('2d');

    // Perform a null check on ctx
    if (!ctx) {
      console.error(`Context not available for canvas with ID '${elementId}'.`);
      return;
    }

    // Check if chart already exists
    let chart = Chart.getChart(ctx);
    if (chart) {
      // If chart exists, update its data
      chart.data.labels = labels.slice(-5); // Get the labels corresponding to the latest five data points
      chart.data.datasets[0].data = dataPaintLevel.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Paint Level',
            data: dataPaintLevel.slice(-5),
            borderColor: 'rgb(0, 255, 243)',
            backgroundColor: 'rgb(0, 255, 243)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x : {
              grid : {
                drawOnChartArea : false
              },
            },
            y: {
              grid : {
                drawOnChartArea : false
              },
              beginAtZero: true
            }
          },
        },
      });
    }
  }

  createOrUpdateChartForflow(elementId: string, type: ValidChartTypes, labels: string[], dataFlow: number[]): void {
    const canvas = document.getElementById(elementId);

    // Check if canvas is an HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error(`Element with ID '${elementId}' is not a canvas.`);
      return;
    }

    const ctx = canvas.getContext('2d');

    // Perform a null check on ctx
    if (!ctx) {
      console.error(`Context not available for canvas with ID '${elementId}'.`);
      return;
    }

    // Check if chart already exists
    let chart = Chart.getChart(ctx);
    if (chart) {
      // If chart exists, update its data
      chart.data.labels = labels.slice(-5); // Get the labels corresponding to the latest five data points
      chart.data.datasets[0].data = dataFlow.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Flow',
            data: dataFlow.slice(-5),
            borderColor: 'rgb(0, 255, 0)',
            backgroundColor: 'rgb(0, 255, 0)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x : {
              grid : {
                drawOnChartArea : false
              },
            },
            y: {
              grid : {
                drawOnChartArea : false
              },
              beginAtZero: true
            }
          },
        },
      });
    }
  }
  // id chart2
  createOrUpdateChartForTemperature(elementId: string, type: ValidChartTypes, labels: string[], dataTemperature: number[]): void {
    const canvas = document.getElementById(elementId);

    // Check if canvas is an HTMLCanvasElement
    if (!(canvas instanceof HTMLCanvasElement)) {
      console.error(`Element with ID '${elementId}' is not a canvas.`);
      return;
    }

    const ctx = canvas.getContext('2d');

    // Perform a null check on ctx
    if (!ctx) {
      console.error(`Context not available for canvas with ID '${elementId}'.`);
      return;
    }

    // Check if chart already exists
    let chart = Chart.getChart(ctx);
    if (chart) {
      // If chart exists, update its data
      chart.data.labels = labels.slice(-5); // Get the labels corresponding to the latest five data points
      chart.data.datasets[0].data = dataTemperature.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Temperature',
            data: dataTemperature.slice(-5),
            borderColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgb(255, 0, 0)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x : {
              grid : {
                drawOnChartArea : false
              },
            },
            y: {
              grid : {
                drawOnChartArea : false
              },
              beginAtZero: true
            }
          },
        },
      });
    }
  }

  // this chart is for echarts : id : chart
  renderChartCompareHumidityAndTemperature(dataTemperature: number[],labels: string[],dataHumidity: number[]): void {
    const chartElement = document.getElementById('chart');
    const myChart = echarts.init(chartElement);
  
    const option = {
      // ECharts configuration options
      legend: {
        data: ['Temperature', 'Humidity']
      },
      xAxis: {
        type: 'category',
        data: labels.slice(-5).reverse(),
        axisLabel: {
          interval: 0, // Display all labels
          rotate: 45, // Rotate labels if needed for better readability
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Temperature (C)',
          position: 'left',
          axisLabel: {
            formatter: '{value} C'
          }
        },
        {
          type: 'value',
          name: 'Humidity',
          position: 'right',
          offset: 0,
          axisLabel: {
            formatter: '{value} L/min'
          }
        }
      ],
      series: [
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 0,
          data: dataTemperature.slice(-5), // Sample humidity data
          lineStyle: {
            color: 'rgb(255, 0, 0)' // Change line color for Flow
          }
        },
        {
          name: 'Humidity',
          type: 'bar',
          yAxisIndex: 1,
          data: dataHumidity.slice(-5), // Sample flow rate data
          itemStyle: {
            color: 'rgb(0, 0, 255)' // Change line color for Flow
          }
        }
      ]
    };
  
    myChart.setOption(option);
  }

   // this chart is for echarts : id : chart3
  renderChartCompareFlowAndPaintLevel(dataFlow: number[],labels: string[],dataPaintLevel: number[]): void {
    const chartElement = document.getElementById('chart3');
    const myChart = echarts.init(chartElement);
  
    const option = {
      // ECharts configuration options
      legend: {
        data: ['Flow', 'Paint Level']
      },
      xAxis: {
        type: 'category',
        data: labels.slice(-5),
        axisLabel: {
          interval: 0, // Display all labels
          rotate: 45, // Rotate labels if needed for better readability
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Flow',
          position: 'left',
          axisLabel: {
            formatter: '{value}'
          }
        },
        {
          type: 'value',
          name: 'Paint Level',
          position: 'right',
          offset: 0,
          axisLabel: {
            formatter: '{value}'
          }
        }
      ],
      series: [
        {
          name: 'Flow',
          type: 'line',
          yAxisIndex: 0,
          data: dataFlow.slice(-5), // Sample Flow data
          lineStyle: {
            color: 'rgb(255, 0, 255)' // Change line color for Flow
          }
        },
        {
          name: 'Paint Level',
          type: 'bar',
          yAxisIndex: 1,
          data: dataPaintLevel.slice(-5), // Sample Paint level rate data
          itemStyle: {
            color: 'rgb(255, 0, 0)' // Change bar color for Paint Level
          }
        }
      ]
    };
  
    myChart.setOption(option);
  }

  // this chart is for echarts : id : chartCompareHumidity
  renderChartHumidity(): void {
    const chartElement = document.getElementById('chartCompareHumidity');
    const myChart = echarts.init(chartElement);

    const option = {
      // ECharts configuration options
      legend: {
        data: ['Month 1', 'Month 2']
      },
      xAxis: [
        {
          type: 'category',
          data: ['a','b','c'],
          axisLine: { onZero: true }
        },
        {
          type: 'category',
          data: ['a','b','c'],
          axisLine: { onZero: true }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Humidity (Month 1)',
          position: 'left',
          axisLabel: {
            formatter: '{value} %'
          }
        },
        {
          type: 'value',
          name: 'Humidity (Month 2)',
          position: 'right',
          axisLabel: {
            formatter: '{value} %'
          }
        }
      ],
      series: [
        {
          name: 'Month 1',
          type: 'bar',
          data: [1,2,3,4],
          xAxisIndex: 0,
          yAxisIndex: 0
        },
        {
          name: 'Month 2',
          type: 'bar',
          data: [5,4,3,4],
          xAxisIndex: 1,
          yAxisIndex: 1
        }
      ]
    };

    myChart.setOption(option);
  }

}


