import { Component, AfterViewInit} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-physique',
  templateUrl: './physique.page.html',
  styleUrls: ['./physique.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class PhysiquePage implements AfterViewInit {

  ngAfterViewInit() {
    this.loadRadarChart();
  }

  loadRadarChart() {
    const ctx = document.getElementById('physiqueRadarChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Shoulders', 'Chest', 'Back', 'Arms', 'Core', 'Legs'],
        datasets: [
          {
            label: 'Physique Stats',
            data: [80, 70, 85, 75, 65, 90],
            borderWidth: 2,
            borderColor: 'rgba(255, 0, 0, 0.8)',
            backgroundColor: 'rgba(255, 0, 0, 0.15)',
            pointBackgroundColor: 'red',
            pointRadius: 4
          },

          /* HEXAGON GRID LINES (REFERENCE SHAPES) */
          {
            label: 'Reference',
            data: [100, 100, 100, 100, 100, 100],
            borderColor: 'rgba(200, 200, 200, 0.3)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          },
          {
            label: '',
            data: [80, 80, 80, 80, 80, 80],
            borderColor: 'rgba(200, 200, 200, 0.25)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          },
          {
            label: '',
            data: [60, 60, 60, 60, 60, 60],
            borderColor: 'rgba(200, 200, 200, 0.2)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          },
          {
            label: '',
            data: [40, 40, 40, 40, 40, 40],
            borderColor: 'rgba(200, 200, 200, 0.15)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          },
          {
            label: '',
            data: [20, 20, 20, 20, 20, 20],
            borderColor: 'rgba(200, 200, 200, 0.1)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      },

      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 100,
            angleLines: { display: false },
            ticks: { display: false },
            grid: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: {
              color: 'white',
              font: { size: 14 }
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }


  constructor() {}
}


