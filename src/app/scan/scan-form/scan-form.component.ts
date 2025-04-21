import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ScanService } from '../scan.service';

@Component({
  selector: 'app-scan-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './scan-form.component.html',
  styleUrls: ['./scan-form.component.css']
})
export class ScanFormComponent {
  url: string = '';
  error: string | null = null;
  isLoading = false;

  constructor(private scanService: ScanService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.error = null;
    this.scanService.startScan(this.url).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/scan/progress', response.scanResultId]);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Erreur lors du lancement du scan';
      }
    });
  }
}