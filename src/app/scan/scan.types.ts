// src/app/scan/scan.types.ts
export interface Scan {
  id: string;
  url: string;
  dateCreation: string;
  dateFin: string | null;
  statutAnalyse: 'EN_COURS' | 'TERMINE' | 'ECHEC';
  scanResultId: string | null;
  vulnerabilities?: Vulnerabilities;
}

// Interface pour typer la réponse brute de l'API GET /api/scan/user/scans
export interface SiteWeb {
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

export interface Vulnerabilities {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export interface Report {
  id: string;
  scanId: string;
  htmlContent: string;
}

export interface Stats {
  scanCount: number;
  bySeverity: { [key: string]: number };
  byType: { [key: string]: number };
}