import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScanService } from '../scan.service';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe],
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent implements OnInit {
  reportHtml: string | null = null;
  scanId: string = '';
  isLoading = true;
  error: string | null = null;
  emailAlertSent: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private scanService: ScanService
  ) {}

  ngOnInit(): void {
    this.scanId = this.route.snapshot.paramMap.get('scanId') || '';
    if (this.scanId) {
      this.loadReport(this.scanId);
    } else {
      this.error = 'ID de scan non fourni';
      this.isLoading = false;
    }
  }

  loadReport(scanId: string): void {
    this.scanService.getReportHtml(scanId).subscribe({
      next: (html) => {
        this.reportHtml = html;
        this.isLoading = false;
        this.emailAlertSent = html.includes('severity-high') || html.includes('Élevé');
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur lors du chargement du rapport';
        this.isLoading = false;
      }
    });
  }

  downloadPDF(): void {
    this.scanService.downloadReportPDF(this.scanId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport-${this.scanId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.error = 'Erreur lors du téléchargement du PDF';
      }
    });
  }
}