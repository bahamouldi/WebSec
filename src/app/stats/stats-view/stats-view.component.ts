import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScanService } from '../../scan/scan.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

export interface Stats {
  scanCount: number;
  bySeverity: { [key: string]: number };
  byType: { [key: string]: number };
}

@Component({
  selector: 'app-stats-view',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './stats-view.component.html',
  styleUrls: ['./stats-view.component.css']
})
export class StatsViewComponent implements OnInit {
  stats: Stats | null = null;
  isLoading = true;
  error: string | null = null;

  public severityChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public typeChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  constructor(
    private scanService: ScanService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.scanService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        if (isPlatformBrowser(this.platformId)) {
          this.updateCharts();
        }
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors de la récupération des statistiques';
        this.isLoading = false;
      }
    });
  }

  updateCharts(): void {
    if (!this.stats) return;

    this.severityChartData = {
      labels: Object.keys(this.stats.bySeverity).map(label => label.charAt(0) + label.slice(1).toLowerCase()),
      datasets: [{
        data: Object.values(this.stats.bySeverity),
        backgroundColor: Object.keys(this.stats.bySeverity).map(severity => this.getColor(severity)),
        borderWidth: 0
      }]
    };

    this.typeChartData = {
      labels: Object.keys(this.stats.byType),
      datasets: [{
        data: Object.values(this.stats.byType),
        backgroundColor: Object.keys(this.stats.byType).map((_, index) => this.getTypeColor(index)),
        borderColor: Object.keys(this.stats.byType).map((_, index) => this.getTypeColor(index)),
        borderWidth: 1
      }]
    };
  }

  getColor(severity: string): string {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return '#ef5350';
      case 'HIGH': return '#ffa726';
      case 'MEDIUM': return '#ffca28';
      case 'LOW': return '#66bb6a';
      case 'INFO': return '#42a5f5';
      default: return '#6b7280';
    }
  }

  getTypeColor(index: number): string {
    const colors = ['#1976d2', '#ef5350', '#66bb6a', '#ffa726', '#42a5f5'];
    return colors[index % colors.length];
  }
}