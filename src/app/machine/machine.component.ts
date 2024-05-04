import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import Chart from 'chart.js/auto';
import { MachinewebsocketService } from '../services/machinewebsocket.service';


enum ValidChartTypes {
  Bar = 'bar',
  Line = 'line',
  Pie = 'pie',
  Radar = 'radar',
  Bubble = 'bubble'
  // Add more chart types as needed
}


@Component({
  selector: 'app-machine',
  templateUrl: './machine.component.html',
  styleUrl: './machine.component.scss'
})
export class MachineComponent implements OnInit{
  
  // machine 1 attributes :
  oeePercentageMachine1 : any;
  performancePercentageMachine1 : any; // Performance
  availabilityPercentageMachine1 : any; // Availability
  qualityPercentageMachine1 : any; // quality
  timeLabelsPerformanceMachine1 : any[] = []; // c'est le meme temps pour toutes les informations
  dataPerformanceMachine1: number[] = []; // Performance en fct du temps
  dataQualityMachine1 :number[] =[]; // Quality en fct du temps
  dataAvailabilityMachine1 : number[]= []; // Availability en fct du temps
  dataRunningTimeMachine1 : number[] =[];
  dataPlannedProductionTimeMachine1 :number []=[];
  dataRunningTimePercentageMachine1 : any;
  dataTotalCountMachine1 : number[] = [];
  dataGoodCountMachine1 : number[] =[];
  dataOeeMachine1 : number [] =[]; // oee en fct du temps

  datesRunningMachine1 : any;
  meanRunningTimeValuesMachine1 : any[] = [];
  meanPlannedProductionTimeValuesMachine1 : any[] = [];


  // machine 2 attributes :
  oeePercentageMachine2 : any;
  performancePercentageMachine2 : any; // Performance
  availabilityPercentageMachine2 : any; // Availability
  qualityPercentageMachine2 : any; // quality
  timeLabelsPerformanceMachine2 : any[] = []; // c'est le meme temps pour toutes les informations
  dataPerformanceMachine2: number[] = []; // Performance en fct du temps
  dataQualityMachine2 :number[] =[]; // Quality en fct du temps
  dataAvailabilityMachine2 : number[]= []; // Availability en fct du temps
  dataRunningTimeMachine2 : number[] =[];
  dataPlannedProductionTimeMachine2 :number []=[];
  dataRunningTimePercentageMachine2 : any;
  dataTotalCountMachine2 : number[] = [];
  dataGoodCountMachine2 : number[] =[];
  dataOeeMachine2 : number [] =[]; // oee en fct du temps

  datesRunningMachine2 : any;
  meanRunningTimeValuesMachine2 : any[] = [];
  meanPlannedProductionTimeValuesMachine2 : any[] = [];

  // machine 3 attributes :
  oeePercentageMachine3 : any;
  performancePercentageMachine3 : any; // Performance
  availabilityPercentageMachine3 : any; // Availability
  qualityPercentageMachine3 : any; // quality
  timeLabelsPerformanceMachine3 : any[] = []; // c'est le meme temps pour toutes les informations
  dataPerformanceMachine3: number[] = []; // Performance en fct du temps
  dataQualityMachine3 :number[] =[]; // Quality en fct du temps
  dataAvailabilityMachine3 : number[]= []; // Availability en fct du temps
  dataRunningTimeMachine3 : number[] =[];
  dataPlannedProductionTimeMachine3 :number []=[];
  dataRunningTimePercentageMachine3 : any;
  dataTotalCountMachine3 : number[] = [];
  dataGoodCountMachine3 : number[] =[];
  dataOeeMachine3 : number [] =[]; // oee en fct du temps

  datesRunningMachine3 : any;
  meanRunningTimeValuesMachine3 : any[] = [];
  meanPlannedProductionTimeValuesMachine3 : any[] = [];

  // machine 4 attributes :
  oeePercentageMachine4 : any;
  performancePercentageMachine4 : any; // Performance
  availabilityPercentageMachine4 : any; // Availability
  qualityPercentageMachine4 : any; // quality
  timeLabelsPerformanceMachine4 : any[] = []; // c'est le meme temps pour toutes les informations
  dataPerformanceMachine4: number[] = []; // Performance en fct du temps
  dataQualityMachine4 :number[] =[]; // Quality en fct du temps
  dataAvailabilityMachine4 : number[]= []; // Availability en fct du temps
  dataRunningTimeMachine4 : number[] =[];
  dataPlannedProductionTimeMachine4 :number []=[];
  dataRunningTimePercentageMachine4 : any;
  dataTotalCountMachine4 : number[] = [];
  dataGoodCountMachine4 : number[] =[];
  dataOeeMachine4 : number [] =[]; // oee en fct du temps

  datesRunningMachine4 : any;
  meanRunningTimeValuesMachine4 : any[] = [];
  meanPlannedProductionTimeValuesMachine4 : any[] = [];

  //
  colorWarn: ThemePalette = 'warn';
  colorAccent: ThemePalette = 'accent';
  colorPrimary: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';

  constructor(private machineWebSocket : MachinewebsocketService){}

  ngOnInit(): void {

    this.machineWebSocket.getRealTimeData().subscribe((data : any) => {
      if(data.machine_1){
        // ---------------------------- total count and good count
        const goodcount : any[] = [];
        const totalCount : any[] = [];
        data.machine_1.forEach((machine : any) => {
          goodcount.push(machine.good_count);
          totalCount.push(machine.total_count);
        });
        this.dataGoodCountMachine1 = goodcount;
        this.dataTotalCountMachine1 = totalCount;

        //----------------------------- running time and planification
        // part for bar chart :
        const runningTime : any[] = [];
        const plannedProductionTime : any[] = [];
        const runningTimeByDay: any = {};
        const plannedProductionTimeByDay: any = {};

        data.machine_1.forEach((machine : any) => {
          runningTime.push(machine.running_time);
          plannedProductionTime.push(machine.planned_production_time);

          const date = new Date(machine.timestamp).toLocaleDateString();
          // If the day does not exist in the runningTimeByDay and plannedProductionTimeByDay objects, initialize it with an empty array
          if (!runningTimeByDay[date]) {
            runningTimeByDay[date] = [];
          }
          if (!plannedProductionTimeByDay[date]) {
            plannedProductionTimeByDay[date] = [];
          }

          // Push the running time and planned production time for the current machine to the corresponding day array
          runningTimeByDay[date].push(machine.running_time);
          plannedProductionTimeByDay[date].push(machine.planned_production_time);

        });

        // Calculate the mean running time and planned production time for each day
        const meanRunningTimeByDay: any = {};
        const meanPlannedProductionTimeByDay: any = {};

        for (const date in runningTimeByDay) {
            meanRunningTimeByDay[date] = this.calculateMean(runningTimeByDay[date]);
        }

        for (const date in plannedProductionTimeByDay) {
            meanPlannedProductionTimeByDay[date] = this.calculateMean(plannedProductionTimeByDay[date]);
        }
        // Extract keys (dates) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.datesRunningMachine1 = Object.keys(meanRunningTimeByDay);

        // Extract values (mean running time and mean planned production time) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.meanRunningTimeValuesMachine1 = Object.values(meanRunningTimeByDay);
        this.meanPlannedProductionTimeValuesMachine1 = Object.values(meanPlannedProductionTimeByDay);
        // -------------------------------------------------- end of bar chart

        this.dataRunningTimeMachine1 = runningTime;
        this.dataPlannedProductionTimeMachine1 = plannedProductionTime;
        // Calculer la moyenne du temps de travail de la machine
        const meanRunningTime = this.calculateMean(runningTime);

        // Calculer la moyenne du temps estimé de production de la machine
        const meanPlannedProductionTime = this.calculateMean(plannedProductionTime);

        // Calculer le pourcentage du temps moyen de travail par rapport au temps estimé
        const workingTimePercentage = (meanRunningTime / meanPlannedProductionTime) * 100;

        // Définir la valeur du pourcentage
        this.dataRunningTimePercentageMachine1 = workingTimePercentage.toFixed(2);

        //----------------------------- this part is for charts :

        // Part for performance
        const performance : any[] = [];
        const time : any [] = [];

        data.machine_1.forEach((machine : any) => {
          performance.push(machine.performance);
          time.push(new Date(machine.timestamp).toLocaleTimeString());
        });
        
        this.dataPerformanceMachine1 = performance;

        // Part for availability
        const chartAvailability : any[] = [];

        data.machine_1.forEach((machine : any) => {
          chartAvailability.push(machine.availability);
        });
        
        this.dataAvailabilityMachine1 = chartAvailability;

        // Part for quality
        const chartQuality : any[] = [];

        data.machine_1.forEach((machine : any) => {
          chartQuality.push(machine.quality);
        });
        
        this.dataQualityMachine1 = chartQuality;

        // Part for oee
        const chartOee : any[] = [];

        data.machine_1.forEach((machine : any) => {
          chartOee.push(machine.Overall_Equipment_Effectiveness);
        });
        
        this.dataOeeMachine1 = chartOee;

        // time is unique btw all of them
        this.timeLabelsPerformanceMachine1 = time;

        // --------------------------------this part is for the progress bar :

        // Part for oee
        const oees : any []= [];

        data.machine_1.forEach((machine : any) => {
          oees.push(machine.Overall_Equipment_Effectiveness);
        });

      
          // Calculate percentage
          const totalInstancesOee = oees.length;
          const totalAvailableoee =  oees.reduce((acc, Overall_Equipment_Effectiveness) => acc + Overall_Equipment_Effectiveness, 0);
          const percentageOee = (totalAvailableoee / (totalInstancesOee * 100)) * 100;
          
          this.oeePercentageMachine1 = percentageOee.toFixed(2);

        // Part for availability
        const availabilities : any []= [];

        data.machine_1.forEach((machine : any) => {
          availabilities.push(machine.availability);
        });

      
          // Calculate percentage
          const totalInstances = availabilities.length;
          const totalAvailable =  availabilities.reduce((acc, availability) => acc + availability, 0);
          const percentage = (totalAvailable / (totalInstances * 100)) * 100;
          
          this.availabilityPercentageMachine1 = percentage.toFixed(2);

        // Part for quality
        const qualities : any []= [];

        data.machine_1.forEach((machine : any) => {
          qualities.push(machine.quality);
        });

      
          // Calculate percentage
          const totalInstancesQualities = qualities.length;
          const totalAvailableQualities =  qualities.reduce((acc, quality) => acc + quality, 0);
          const percentageQuality = (totalAvailableQualities / (totalInstancesQualities * 100)) * 100;
          
          this.qualityPercentageMachine1 = percentageQuality.toFixed(2);

        // Part for performance
        const performances : any []= [];

        data.machine_1.forEach((machine : any) => {
          performances.push(machine.performance);
        });

      
          // Calculate percentage
          const totalInstancesPerformance = performances.length;
          const totalAvailablePerformance =  performances.reduce((acc, performance) => acc + performance, 0);
          const percentagePerformance = (totalAvailablePerformance / (totalInstancesPerformance * 100)) * 100;
          
          this.performancePercentageMachine1 = percentagePerformance.toFixed(2);

      }/// end of machine 1 treatement

      if(data.machine_2){
        // ---------------------------- total count and good count
        const goodcount : any[] = [];
        const totalCount : any[] = [];
        data.machine_2.forEach((machine : any) => {
          goodcount.push(machine.good_count);
          totalCount.push(machine.total_count);
        });
        this.dataGoodCountMachine2 = goodcount;
        this.dataTotalCountMachine2 = totalCount;

        //----------------------------- running time and planification
        const runningTime : any[] = [];
        const plannedProductionTime : any[] = [];
        const runningTimeByDay: any = {};
        const plannedProductionTimeByDay: any = {};
        data.machine_2.forEach((machine : any) => {
          runningTime.push(machine.running_time);
          plannedProductionTime.push(machine.planned_production_time);

          const date = new Date(machine.timestamp).toLocaleDateString();
          // If the day does not exist in the runningTimeByDay and plannedProductionTimeByDay objects, initialize it with an empty array
          if (!runningTimeByDay[date]) {
            runningTimeByDay[date] = [];
          }
          if (!plannedProductionTimeByDay[date]) {
            plannedProductionTimeByDay[date] = [];
          }

          // Push the running time and planned production time for the current machine to the corresponding day array
          runningTimeByDay[date].push(machine.running_time);
          plannedProductionTimeByDay[date].push(machine.planned_production_time);
        });
        // Calculate the mean running time and planned production time for each day
        const meanRunningTimeByDay: any = {};
        const meanPlannedProductionTimeByDay: any = {};

        for (const date in runningTimeByDay) {
            meanRunningTimeByDay[date] = this.calculateMean(runningTimeByDay[date]);
        }

        for (const date in plannedProductionTimeByDay) {
            meanPlannedProductionTimeByDay[date] = this.calculateMean(plannedProductionTimeByDay[date]);
        }
        // Extract keys (dates) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.datesRunningMachine2 = Object.keys(meanRunningTimeByDay);

        // Extract values (mean running time and mean planned production time) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.meanRunningTimeValuesMachine2 = Object.values(meanRunningTimeByDay);
        this.meanPlannedProductionTimeValuesMachine2 = Object.values(meanPlannedProductionTimeByDay);
        // -------------------------------------------------- end of bar chart

        this.dataRunningTimeMachine2 = runningTime;
        this.dataPlannedProductionTimeMachine2 = plannedProductionTime;
        // Calculer la moyenne du temps de travail de la machine
        const meanRunningTime = this.calculateMean(runningTime);

        // Calculer la moyenne du temps estimé de production de la machine
        const meanPlannedProductionTime = this.calculateMean(plannedProductionTime);

        // Calculer le pourcentage du temps moyen de travail par rapport au temps estimé
        const workingTimePercentage = (meanRunningTime / meanPlannedProductionTime) * 100;

        // Définir la valeur du pourcentage
        this.dataRunningTimePercentageMachine2 = workingTimePercentage.toFixed(2);

        //----------------------------- this part is for charts :

        // Part for performance
        const performance : any[] = [];
        const time : any [] = [];

        data.machine_2.forEach((machine : any) => {
          performance.push(machine.performance);
          time.push(new Date(machine.timestamp).toLocaleTimeString());
        });
        
        this.dataPerformanceMachine2 = performance;
        
        // Part for availability
        const chartAvailability : any[] = [];

        data.machine_2.forEach((machine : any) => {
          chartAvailability.push(machine.availability);
        });
        
        this.dataAvailabilityMachine2 = chartAvailability;

        // Part for quality
        const chartQuality : any[] = [];

        data.machine_2.forEach((machine : any) => {
          chartQuality.push(machine.quality);
        });
        
        this.dataQualityMachine2 = chartQuality;

        // Part for oee
        const chartOee : any[] = [];

        data.machine_2.forEach((machine : any) => {
          chartOee.push(machine.Overall_Equipment_Effectiveness);
        });
        
        this.dataOeeMachine2 = chartOee;

        // time is unique btw all of them
        this.timeLabelsPerformanceMachine2 = time;

        // --------------------------------this part is for the progress bar :

        // Part for oee
        const oees : any []= [];

        data.machine_2.forEach((machine : any) => {
          oees.push(machine.Overall_Equipment_Effectiveness);
        });

      
          // Calculate percentage
          const totalInstancesOee = oees.length;
          const totalAvailableoee =  oees.reduce((acc, Overall_Equipment_Effectiveness) => acc + Overall_Equipment_Effectiveness, 0);
          const percentageOee = (totalAvailableoee / (totalInstancesOee * 100)) * 100;
          
          this.oeePercentageMachine2 = percentageOee.toFixed(2);

        // Part for availability
        const availabilities : any []= [];

        data.machine_2.forEach((machine : any) => {
          availabilities.push(machine.availability);
        });

        // Calculate percentage
        const totalInstances = availabilities.length;
        const totalAvailable =  availabilities.reduce((acc, availability) => acc + availability, 0);
        const percentage = (totalAvailable / (totalInstances * 100)) * 100;
        
        this.availabilityPercentageMachine2 = percentage.toFixed(2);

      // Part for quality
      const qualities : any []= [];

      data.machine_2.forEach((machine : any) => {
        qualities.push(machine.quality);
      });

      // Calculate percentage
      const totalInstancesQualities = qualities.length;
      const totalAvailableQualities =  qualities.reduce((acc, quality) => acc + quality, 0);
      const percentageQuality = (totalAvailableQualities / (totalInstancesQualities * 100)) * 100;
      
      this.qualityPercentageMachine2 = percentageQuality.toFixed(2);

    // Part for performance
    const performances : any []= [];

    data.machine_2.forEach((machine : any) => {
      performances.push(machine.performance);
    });

  
      // Calculate percentage
      const totalInstancesPerformance = performances.length;
      const totalAvailablePerformance =  performances.reduce((acc, performance) => acc + performance, 0);
      const percentagePerformance = (totalAvailablePerformance / (totalInstancesPerformance * 100)) * 100;
      
      this.performancePercentageMachine2 = percentagePerformance.toFixed(2);
        
      
      }// end of machine 2 treatement

      if(data.machine_3){

        // ---------------------------- total count and good count
        const goodcount : any[] = [];
        const totalCount : any[] = [];
        data.machine_3.forEach((machine : any) => {
          goodcount.push(machine.good_count);
          totalCount.push(machine.total_count);
        });
        this.dataGoodCountMachine3 = goodcount;
        this.dataTotalCountMachine3 = totalCount;

        //----------------------------- running time and planification
        const runningTime : any[] = [];
        const plannedProductionTime : any[] = [];
        const runningTimeByDay: any = {};
        const plannedProductionTimeByDay: any = {};
        data.machine_3.forEach((machine : any) => {
          runningTime.push(machine.running_time);
          plannedProductionTime.push(machine.planned_production_time);

          const date = new Date(machine.timestamp).toLocaleDateString();
          // If the day does not exist in the runningTimeByDay and plannedProductionTimeByDay objects, initialize it with an empty array
          if (!runningTimeByDay[date]) {
            runningTimeByDay[date] = [];
          }
          if (!plannedProductionTimeByDay[date]) {
            plannedProductionTimeByDay[date] = [];
          }

          // Push the running time and planned production time for the current machine to the corresponding day array
          runningTimeByDay[date].push(machine.running_time);
          plannedProductionTimeByDay[date].push(machine.planned_production_time);
        });

        // Calculate the mean running time and planned production time for each day
        const meanRunningTimeByDay: any = {};
        const meanPlannedProductionTimeByDay: any = {};

        for (const date in runningTimeByDay) {
            meanRunningTimeByDay[date] = this.calculateMean(runningTimeByDay[date]);
        }

        for (const date in plannedProductionTimeByDay) {
            meanPlannedProductionTimeByDay[date] = this.calculateMean(plannedProductionTimeByDay[date]);
        }
        // Extract keys (dates) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.datesRunningMachine3 = Object.keys(meanRunningTimeByDay);

        // Extract values (mean running time and mean planned production time) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.meanRunningTimeValuesMachine3 = Object.values(meanRunningTimeByDay);
        this.meanPlannedProductionTimeValuesMachine3 = Object.values(meanPlannedProductionTimeByDay);
        // -------------------------------------------------- end of bar chart
        this.dataRunningTimeMachine3 = runningTime;
        this.dataPlannedProductionTimeMachine3 = plannedProductionTime;
        // Calculer la moyenne du temps de travail de la machine
        const meanRunningTime = this.calculateMean(runningTime);

        // Calculer la moyenne du temps estimé de production de la machine
        const meanPlannedProductionTime = this.calculateMean(plannedProductionTime);

        // Calculer le pourcentage du temps moyen de travail par rapport au temps estimé
        const workingTimePercentage = (meanRunningTime / meanPlannedProductionTime) * 100;

        // Définir la valeur du pourcentage
        this.dataRunningTimePercentageMachine3 = workingTimePercentage.toFixed(2);
        
        //----------------------------- this part is for charts :

        // Part for performance
        const performance : any[] = [];
        const time : any [] = [];

        data.machine_3.forEach((machine : any) => {
          performance.push(machine.performance);
          time.push(new Date(machine.timestamp).toLocaleTimeString());
        });
        
        this.dataPerformanceMachine3 = performance;

        // Part for availability
        const chartAvailability : any[] = [];

        data.machine_3.forEach((machine : any) => {
          chartAvailability.push(machine.availability);
        });
        
        this.dataAvailabilityMachine3 = chartAvailability;

        // Part for quality
        const chartQuality : any[] = [];

        data.machine_3.forEach((machine : any) => {
          chartQuality.push(machine.quality);
        });
        
        this.dataQualityMachine3 = chartQuality;

        // Part for oee
        const chartOee : any[] = [];

        data.machine_3.forEach((machine : any) => {
          chartOee.push(machine.Overall_Equipment_Effectiveness);
        });
        
        this.dataOeeMachine3 = chartOee;

        // time is unique btw all of them
        this.timeLabelsPerformanceMachine3 = time;

        // --------------------------------this part is for the progress bar :

        // Part for oee
        const oees : any []= [];

        data.machine_3.forEach((machine : any) => {
          oees.push(machine.Overall_Equipment_Effectiveness);
        });

      
          // Calculate percentage
          const totalInstancesOee = oees.length;
          const totalAvailableoee =  oees.reduce((acc, Overall_Equipment_Effectiveness) => acc + Overall_Equipment_Effectiveness, 0);
          const percentageOee = (totalAvailableoee / (totalInstancesOee * 100)) * 100;
          
          this.oeePercentageMachine3 = percentageOee.toFixed(2);

          // Part for availability
        const availabilities : any []= [];

        data.machine_3.forEach((machine : any) => {
          availabilities.push(machine.availability);
        });

      
          // Calculate percentage
          const totalInstances = availabilities.length;
          const totalAvailable =  availabilities.reduce((acc, availability) => acc + availability, 0);
          const percentage = (totalAvailable / (totalInstances * 100)) * 100;
          
          this.availabilityPercentageMachine3 = percentage.toFixed(2);

          // Part for quality
        const qualities : any []= [];

        data.machine_3.forEach((machine : any) => {
          qualities.push(machine.quality);
        });

      
          // Calculate percentage
          const totalInstancesQualities = qualities.length;
          const totalAvailableQualities =  qualities.reduce((acc, quality) => acc + quality, 0);
          const percentageQuality = (totalAvailableQualities / (totalInstancesQualities * 100)) * 100;
          
          this.qualityPercentageMachine3 = percentageQuality.toFixed(2);

          // Part for performance
        const performances : any []= [];

        data.machine_3.forEach((machine : any) => {
          performances.push(machine.performance);
        });

      
          // Calculate percentage
          const totalInstancesPerformance = performances.length;
          const totalAvailablePerformance =  performances.reduce((acc, performance) => acc + performance, 0);
          const percentagePerformance = (totalAvailablePerformance / (totalInstancesPerformance * 100)) * 100;
          
          this.performancePercentageMachine3 = percentagePerformance.toFixed(2);

      }// end of machine 3 treatement

      if(data.machine_4){
        
        // ---------------------------- total count and good count
        const goodcount : any[] = [];
        const totalCount : any[] = [];
        data.machine_4.forEach((machine : any) => {
          goodcount.push(machine.good_count);
          totalCount.push(machine.total_count);
        });
        this.dataGoodCountMachine4 = goodcount;
        this.dataTotalCountMachine4 = totalCount;

        //----------------------------- running time and planification
        const runningTime : any[] = [];
        const plannedProductionTime : any[] = [];
        const runningTimeByDay: any = {};
        const plannedProductionTimeByDay: any = {};

        data.machine_4.forEach((machine : any) => {
          runningTime.push(machine.running_time);
          plannedProductionTime.push(machine.planned_production_time);

          const date = new Date(machine.timestamp).toLocaleDateString();
          // If the day does not exist in the runningTimeByDay and plannedProductionTimeByDay objects, initialize it with an empty array
          if (!runningTimeByDay[date]) {
            runningTimeByDay[date] = [];
          }
          if (!plannedProductionTimeByDay[date]) {
            plannedProductionTimeByDay[date] = [];
          }

          // Push the running time and planned production time for the current machine to the corresponding day array
          runningTimeByDay[date].push(machine.running_time);
          plannedProductionTimeByDay[date].push(machine.planned_production_time);
        });

        // Calculate the mean running time and planned production time for each day
        const meanRunningTimeByDay: any = {};
        const meanPlannedProductionTimeByDay: any = {};

        for (const date in runningTimeByDay) {
            meanRunningTimeByDay[date] = this.calculateMean(runningTimeByDay[date]);
        }

        for (const date in plannedProductionTimeByDay) {
            meanPlannedProductionTimeByDay[date] = this.calculateMean(plannedProductionTimeByDay[date]);
        }
        // Extract keys (dates) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.datesRunningMachine4 = Object.keys(meanRunningTimeByDay);

        // Extract values (mean running time and mean planned production time) from meanRunningTimeByDay and meanPlannedProductionTimeByDay objects
        this.meanRunningTimeValuesMachine4 = Object.values(meanRunningTimeByDay);
        this.meanPlannedProductionTimeValuesMachine4 = Object.values(meanPlannedProductionTimeByDay);
        // -------------------------------------------------- end of bar chart
        this.dataRunningTimeMachine4 = runningTime;
        this.dataPlannedProductionTimeMachine4 = plannedProductionTime;
        // Calculer la moyenne du temps de travail de la machine
        const meanRunningTime = this.calculateMean(runningTime);

        // Calculer la moyenne du temps estimé de production de la machine
        const meanPlannedProductionTime = this.calculateMean(plannedProductionTime);

        // Calculer le pourcentage du temps moyen de travail par rapport au temps estimé
        const workingTimePercentage = (meanRunningTime / meanPlannedProductionTime) * 100;

        // Définir la valeur du pourcentage
        this.dataRunningTimePercentageMachine4 = workingTimePercentage.toFixed(2);

        //----------------------------- this part is for charts :

        // Part for performance
        const performance : any[] = [];
        const time : any [] = [];

        data.machine_4.forEach((machine : any) => {
          performance.push(machine.performance);
          time.push(new Date(machine.timestamp).toLocaleTimeString());
        });
        
        this.dataPerformanceMachine4 = performance;

        // Part for availability
        const chartAvailability : any[] = [];

        data.machine_4.forEach((machine : any) => {
          chartAvailability.push(machine.availability);
        });
        
        this.dataAvailabilityMachine4 = chartAvailability;

        // Part for quality
        const chartQuality : any[] = [];

        data.machine_4.forEach((machine : any) => {
          chartQuality.push(machine.quality);
        });
        
        this.dataQualityMachine4 = chartQuality;

        // Part for oee
        const chartOee : any[] = [];

        data.machine_4.forEach((machine : any) => {
          chartOee.push(machine.Overall_Equipment_Effectiveness);
        });
        
        this.dataOeeMachine4 = chartOee;

        // time is unique btw all of them
        this.timeLabelsPerformanceMachine4 = time;

        // --------------------------------this part is for the progress bar :

        // Part for oee
        const oees : any []= [];

        data.machine_4.forEach((machine : any) => {
          oees.push(machine.Overall_Equipment_Effectiveness);
        });

      
          // Calculate percentage
          const totalInstancesOee = oees.length;
          const totalAvailableoee =  oees.reduce((acc, Overall_Equipment_Effectiveness) => acc + Overall_Equipment_Effectiveness, 0);
          const percentageOee = (totalAvailableoee / (totalInstancesOee * 100)) * 100;
          
          this.oeePercentageMachine4 = percentageOee.toFixed(2);

          // Part for availability
        const availabilities : any []= [];

        data.machine_4.forEach((machine : any) => {
          availabilities.push(machine.availability);
        });

      
          // Calculate percentage
          const totalInstances = availabilities.length;
          const totalAvailable =  availabilities.reduce((acc, availability) => acc + availability, 0);
          const percentage = (totalAvailable / (totalInstances * 100)) * 100;
          
          this.availabilityPercentageMachine4 = percentage.toFixed(2);

          // Part for quality
        const qualities : any []= [];

        data.machine_4.forEach((machine : any) => {
          qualities.push(machine.quality);
        });

      
          // Calculate percentage
          const totalInstancesQualities = qualities.length;
          const totalAvailableQualities =  qualities.reduce((acc, quality) => acc + quality, 0);
          const percentageQuality = (totalAvailableQualities / (totalInstancesQualities * 100)) * 100;
          
          this.qualityPercentageMachine4 = percentageQuality.toFixed(2);

          // Part for performance
        const performances : any []= [];

        data.machine_4.forEach((machine : any) => {
          performances.push(machine.performance);
        });

      
          // Calculate percentage
          const totalInstancesPerformance = performances.length;
          const totalAvailablePerformance =  performances.reduce((acc, performance) => acc + performance, 0);
          const percentagePerformance = (totalAvailablePerformance / (totalInstancesPerformance * 100)) * 100;
          
          this.performancePercentageMachine4 = percentagePerformance.toFixed(2);

      }// end of machine 3 treatement

      //Tous ce qui concerne la machine 1 :
      this.createOrUpdateChartForAvailabilityMachine('chartAvailabilityMachine1',ValidChartTypes.Line,this.timeLabelsPerformanceMachine1,this.dataAvailabilityMachine1);
      this.createOrUpdateChartForQualityMachine('chartQualityMachine1',ValidChartTypes.Line,this.timeLabelsPerformanceMachine1,this.dataQualityMachine1);
      this.createOrUpdateChartForPerformanceMachine('chartPerformanceMachine1',ValidChartTypes.Line,this.timeLabelsPerformanceMachine1,this.dataPerformanceMachine1);
      this.createOrUpdateChartForTimeMachine('chartRunningTimeMachine1',ValidChartTypes.Bar,this.datesRunningMachine1,this.meanRunningTimeValuesMachine1,this.meanPlannedProductionTimeValuesMachine1);
      this.createOrUpdateChartForCountMachine('chartGoodMachine1',ValidChartTypes.Bar,this.timeLabelsPerformanceMachine1,this.dataTotalCountMachine1,this.dataGoodCountMachine1);

      //Tous ce qui concerne la machine 2 :
      this.createOrUpdateChartForAvailabilityMachine('chartAvailabilityMachine2',ValidChartTypes.Line,this.timeLabelsPerformanceMachine2,this.dataAvailabilityMachine2);
      this.createOrUpdateChartForQualityMachine('chartQualityMachine2',ValidChartTypes.Line,this.timeLabelsPerformanceMachine2,this.dataQualityMachine2);
      this.createOrUpdateChartForPerformanceMachine('chartPerformanceMachine2',ValidChartTypes.Line,this.timeLabelsPerformanceMachine2,this.dataPerformanceMachine2);
      this.createOrUpdateChartForTimeMachine('chartRunningTimeMachine2',ValidChartTypes.Bar,this.datesRunningMachine2,this.meanRunningTimeValuesMachine2,this.meanPlannedProductionTimeValuesMachine2);
      this.createOrUpdateChartForCountMachine('chartGoodMachine2',ValidChartTypes.Bar,this.timeLabelsPerformanceMachine2,this.dataTotalCountMachine2,this.dataGoodCountMachine2);
      //Tous ce qui concerne la machine 3 :
      this.createOrUpdateChartForAvailabilityMachine('chartAvailabilityMachine3',ValidChartTypes.Line,this.timeLabelsPerformanceMachine3,this.dataAvailabilityMachine3);
      this.createOrUpdateChartForQualityMachine('chartQualityMachine3',ValidChartTypes.Line,this.timeLabelsPerformanceMachine3,this.dataQualityMachine3);
      this.createOrUpdateChartForPerformanceMachine('chartPerformanceMachine3',ValidChartTypes.Line,this.timeLabelsPerformanceMachine3,this.dataPerformanceMachine3);
      this.createOrUpdateChartForTimeMachine('chartRunningTimeMachine3',ValidChartTypes.Bar,this.datesRunningMachine3,this.meanRunningTimeValuesMachine3,this.meanPlannedProductionTimeValuesMachine3);
      this.createOrUpdateChartForCountMachine('chartGoodMachine3',ValidChartTypes.Bar,this.timeLabelsPerformanceMachine3,this.dataTotalCountMachine3,this.dataGoodCountMachine3);
      //Tous ce qui concerne la machine 4 :
      this.createOrUpdateChartForAvailabilityMachine('chartAvailabilityMachine4',ValidChartTypes.Line,this.timeLabelsPerformanceMachine4,this.dataAvailabilityMachine4);
      this.createOrUpdateChartForQualityMachine('chartQualityMachine4',ValidChartTypes.Line,this.timeLabelsPerformanceMachine4,this.dataQualityMachine4);
      this.createOrUpdateChartForPerformanceMachine('chartPerformanceMachine4',ValidChartTypes.Line,this.timeLabelsPerformanceMachine4,this.dataPerformanceMachine4);
      this.createOrUpdateChartForTimeMachine('chartRunningTimeMachine4',ValidChartTypes.Bar,this.datesRunningMachine4,this.meanRunningTimeValuesMachine4,this.meanPlannedProductionTimeValuesMachine4);
      this.createOrUpdateChartForCountMachine('chartGoodMachine4',ValidChartTypes.Bar,this.timeLabelsPerformanceMachine4,this.dataTotalCountMachine4,this.dataGoodCountMachine4);
      //Tous ce qui concerne toutes les machines :
      this.createOrUpdateChartForPerformance('chartPerformance', ValidChartTypes.Line, this.timeLabelsPerformanceMachine1, this.dataPerformanceMachine1,this.dataPerformanceMachine2,this.dataPerformanceMachine3,this.dataPerformanceMachine4);
      this.createOrUpdateChartForPerformance('chartAvailability', ValidChartTypes.Line, this.timeLabelsPerformanceMachine1, this.dataAvailabilityMachine1,this.dataAvailabilityMachine2,this.dataAvailabilityMachine3,this.dataAvailabilityMachine4);
      this.createOrUpdateChartForPerformance('chartQuality', ValidChartTypes.Line, this.timeLabelsPerformanceMachine1, this.dataQualityMachine1,this.dataQualityMachine2,this.dataQualityMachine3,this.dataQualityMachine4);
      this.createOrUpdateChartForPerformance('chartOEE', ValidChartTypes.Line, this.timeLabelsPerformanceMachine1, this.dataOeeMachine1,this.dataOeeMachine2,this.dataOeeMachine3,this.dataOeeMachine4);

    });
  }

  // Fonction pour calculer la moyenne d'un tableau
  calculateMean(array: any[]): number {
    const sum = array.reduce((acc, val) => acc + val, 0);
    return sum / array.length;
  }

  //Machine 1
  createOrUpdateChartForCountMachine(elementId: string, type: ValidChartTypes, labels: string[], dataTotalCountMachine1: number[], dataGoodCountMachine1:number[]): void {
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
      chart.data.datasets[0].data = dataTotalCountMachine1.slice(-5);
      chart.data.datasets[1].data = dataGoodCountMachine1.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Total Count',
            data: dataTotalCountMachine1.slice(-5),
            borderColor: 'rgb(0, 0, 255)',
            backgroundColor: 'rgb(0, 0, 255)',
            borderWidth: 1
          },
          {
            label: 'Good Count',
            data: dataGoodCountMachine1.slice(-5),
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

  createOrUpdateChartForTimeMachine(elementId: string, type: ValidChartTypes, labels: string[], dataRunningTimeMachine1: number[], dataPlannedProductionTimeMachine1:number[]): void {
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
      chart.data.datasets[0].data = dataPlannedProductionTimeMachine1.slice(-5);
      chart.data.datasets[1].data = dataRunningTimeMachine1.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Planned Time',
            data: dataPlannedProductionTimeMachine1.slice(-5),
            borderColor: 'rgb(0, 0, 255)',
            backgroundColor: 'rgb(0, 0, 255)',
            borderWidth: 1
          },
          {
            label: 'Running Time',
            data: dataRunningTimeMachine1.slice(-5),
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

  createOrUpdateChartForAvailabilityMachine(elementId: string, type: ValidChartTypes, labels: string[], dataAvailabilityMachine1: number[]): void {
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
      chart.data.datasets[0].data = dataAvailabilityMachine1.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Availability',
            data: dataAvailabilityMachine1.slice(-5),
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

  createOrUpdateChartForQualityMachine(elementId: string, type: ValidChartTypes, labels: string[], dataQualityMachine1: number[]): void {
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
      chart.data.datasets[0].data = dataQualityMachine1.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Quality',
            data: dataQualityMachine1.slice(-5),
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

  createOrUpdateChartForPerformanceMachine(elementId: string, type: ValidChartTypes, labels: string[], dataPerformanceMachine1: number[]): void {
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
      chart.data.datasets[0].data = dataPerformanceMachine1.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Performance',
            data: dataPerformanceMachine1.slice(-5),
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


  //Performance for all machines
  createOrUpdateChartForPerformance(elementId: string, type: ValidChartTypes, labels: string[], dataPerformanceMachine1: number[],dataPerformanceMachine2: number[],dataPerformanceMachine3: number[],dataPerformanceMachine4: number[]): void {
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
      chart.data.datasets[0].data = dataPerformanceMachine1.slice(-5);
      chart.data.datasets[1].data = dataPerformanceMachine2.slice(-5);
      chart.data.datasets[2].data = dataPerformanceMachine3.slice(-5);
      chart.data.datasets[3].data = dataPerformanceMachine4.slice(-5);
      chart.update();
    } else {
      // If chart doesn't exist, create a new chart
      new Chart(ctx, {
        type: type,
        data: {
          labels: labels.slice(-5), // Get the labels corresponding to the latest five data points,
          datasets: [{
            label: 'Machine 1',
            data: dataPerformanceMachine1.slice(-5),
            borderColor: 'rgb(0, 0, 255)',
            backgroundColor: 'rgb(0, 0, 255)',
            borderWidth: 1
          },
          {
            label: 'Machine 2',
            data: dataPerformanceMachine2.slice(-5),
            borderColor: 'rgb(0, 255, 0)',
            backgroundColor: 'rgb(0, 255, 0)',
            borderWidth: 1
          },
          {
            label: 'Machine 3',
            data: dataPerformanceMachine3.slice(-5),
            borderColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgb(255, 0, 0)',
            borderWidth: 1
          },
          {
            label: 'Machine 4',
            data: dataPerformanceMachine4.slice(-5),
            borderColor: 'rgb(50, 100, 100)',
            backgroundColor: 'rgb(50, 100, 100)',
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

}
