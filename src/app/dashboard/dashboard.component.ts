import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScanService } from '../scan/scan.service';
import { AuthService } from '../auth/auth.service';
import { UserService, User } from '../user.service';
import { Scan, Stats, Vulnerabilities } from '../scan/scan.types';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SummaryComponent } from '../summary/summary.component';

// Interface temporaire pour typer la réponse brute de l'API
interface SiteWeb {
  id: number;
  url: string;
  statutAnalyse: 'EN_COURS' | 'TERMINE' | 'ECHEC';
  dateSoumission: string;
  scanResults: Array<{
    id: number;
    targetUrl: string;
    scanDate: string;
    progress: number;
  }>;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, SummaryComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  scans: Scan[] = [];
  latestVulnerabilities: Vulnerabilities = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  };
  stats: {
    totalScans: number;
    completedScans: number;
    runningScans: number;
    criticalVulnerabilities: number;
    highVulnerabilities: number;
    mediumVulnerabilities: number;
    lowVulnerabilities: number;
    infoVulnerabilities: number;
  } = {
    totalScans: 0,
    completedScans: 0,
    runningScans: 0,
    criticalVulnerabilities: 0,
    highVulnerabilities: 0,
    mediumVulnerabilities: 0,
    lowVulnerabilities: 0,
    infoVulnerabilities: 0
  };
  userName: string | null = null;
  isLoading = true;
  error: string | null = null;
  message: string | null = null;

  constructor(
    private scanService: ScanService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params: Params) => {
      this.message = params['message'] || null;
    });
  }

  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur connecté
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.userName = user.nom || 'Utilisateur';
      },
      error: (err: HttpErrorResponse) => {
        this.userName = 'Utilisateur';
        console.error('Erreur lors de la récupération de l’utilisateur:', err);
      }
    });

    // Charger les statistiques du tableau de bord
    this.scanService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.totalScans = data.totalScans;
        this.stats.completedScans = data.completedScans;
        this.stats.runningScans = data.runningScans;
        this.stats.criticalVulnerabilities = data.criticalVulnerabilities;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des stats du tableau de bord:', err);
        this.error = 'Erreur lors de la récupération des statistiques';
      }
    });

    // Charger les scans pour la section "Scans récents"
    this.scanService.getUserScans().subscribe({
      next: (data: SiteWeb[]) => {
        this.scans = data.map((site: SiteWeb) => {
          // Chaque SiteWeb contient une liste de ScanResult, prenons le dernier pour dateFin et scanResultId
          const latestScanResult = site.scanResults && site.scanResults.length > 0
            ? site.scanResults[site.scanResults.length - 1]
            : null;
          return {
            id: site.id.toString(),
            url: site.url,
            dateCreation: site.dateSoumission, // dateSoumission est mappé à dateCreation
            dateFin: latestScanResult ? latestScanResult.scanDate : null,
            statutAnalyse: site.statutAnalyse,
            scanResultId: latestScanResult ? latestScanResult.id.toString() : null,
            vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0, info: 0 }
          };
        });
        console.log('Scans récupérés:', this.scans);

        // Trier les scans par date (le plus récent en premier)
        this.scans.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());

        // Récupérer les vulnérabilités pour chaque scan terminé
        this.scans.forEach((scan: Scan) => {
          if (scan.statutAnalyse === 'TERMINE' && scan.scanResultId) {
            this.scanService.getReportHtml(scan.scanResultId).subscribe({
              next: (html: string) => {
                scan.vulnerabilities = this.parseVulnerabilitiesFromHtml(html);
                console.log(`Vulnérabilités pour le scan ${scan.id} (${scan.url}):`, scan.vulnerabilities);
                // Si c'est le scan le plus récent, mettre à jour latestVulnerabilities
                if (this.scans[0] === scan) {
                  this.latestVulnerabilities = scan.vulnerabilities;
                }
              },
              error: (err: HttpErrorResponse) => {
                console.error(`Erreur lors de la récupération du rapport pour le scan ${scan.id}:`, err);
                scan.vulnerabilities = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
              }
            });
          } else {
            scan.vulnerabilities = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
          }
        });

        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Erreur lors de la récupération des scans';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });

    // Charger les stats pour les vulnérabilités globales (pour le résumé)
    this.scanService.getStats().subscribe({
      next: (data: Stats) => {
        this.stats.highVulnerabilities = data.bySeverity['HIGH'] || 0;
        this.stats.mediumVulnerabilities = data.bySeverity['MEDIUM'] || 0;
        this.stats.lowVulnerabilities = data.bySeverity['LOW'] || 0;
        this.stats.infoVulnerabilities = data.bySeverity['INFO'] || 0;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des stats:', err);
      }
    });
  }

  // Méthode pour parser les vulnérabilités à partir du HTML
  private parseVulnerabilitiesFromHtml(html: string): Vulnerabilities {
    const vulnerabilities: Vulnerabilities = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    };

    // Créer un élément DOM temporaire pour parser le HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Trouver le tableau "Résumé des vulnérabilités"
    const tables = doc.getElementsByTagName('table');
    let summaryTable: HTMLTableElement | null = null;
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      if (table.previousElementSibling?.textContent?.includes('Résumé des vulnérabilités')) {
        summaryTable = table;
        break;
      }
    }

    if (summaryTable) {
      const rows = summaryTable.getElementsByTagName('tr');
      for (let i = 1; i < rows.length; i++) { // Commencer à 1 pour ignorer l'en-tête
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 2) {
          const severity = cells[0].textContent?.trim();
          const count = parseInt(cells[1].textContent?.trim() || '0', 10);

          if (severity?.includes('Élevé') || severity?.includes('High')) {
            vulnerabilities.high = count;
          } else if (severity?.includes('Modéré') || severity?.includes('Medium')) {
            vulnerabilities.medium = count;
          } else if (severity?.includes('Bas') || severity?.includes('Low')) {
            vulnerabilities.low = count;
          } else if (severity?.includes('Informatif') || severity?.includes('Informative')) {
            vulnerabilities.info = count;
          }
        }
      }
    }

    return vulnerabilities;
  }
}