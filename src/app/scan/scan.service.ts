import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Scan, Report, Stats, Vulnerabilities, SiteWeb } from './scan.types'; // Import SiteWeb
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScanService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  startScan(url: string): Observable<{ siteId: string; scanResultId: string }> {
    return this.http.post<{ siteId: string; scanResultId: string }>(`${this.baseUrl}/scan/start`, { url });
  }

  getScanProgress(scanId: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/scan/progress/${scanId}`);
  }

  getReport(scanId: string): Observable<Report> {
    return this.http.get<Report>(`${this.baseUrl}/rapports/${scanId}`);
  }

  downloadReportPDF(scanId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/scan/rapports/generer/${scanId}`, { responseType: 'blob' });
  }

  getReportHtml(scanId: string): Observable<string> {
    return this.http.get(`${this.baseUrl}/scan/rapports/generer-html/${scanId}`, { responseType: 'text' });
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.baseUrl}/scan/stats`);
  }

  getUserScans(): Observable<SiteWeb[]> { // Changé de Scan[] à SiteWeb[]
    return this.http.get<SiteWeb[]>(`${this.baseUrl}/scan/user/scans`);
  }

  getVulnerabilities(scanId: string): Observable<Vulnerabilities> {
    return this.http.get<Vulnerabilities>(`${this.baseUrl}/scan/vulnerabilities/${scanId}`);
  }

  getDashboardStats(): Observable<{
    totalScans: number;
    completedScans: number;
    runningScans: number;
    criticalVulnerabilities: number;
  }> {
    return this.http.get<{
      totalScans: number;
      completedScans: number;
      runningScans: number;
      criticalVulnerabilities: number;
    }>(`${this.baseUrl}/scan/dashboard-stats`);
  }
}