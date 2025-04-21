import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ScanService } from '../scan.service';
import { WebsocketService } from '../../shared/websocket.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-scan-progress',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scan-progress.component.html',
  styleUrls: ['./scan-progress.component.css']
})
export class ScanProgressComponent implements OnInit, OnDestroy {
  scanId: string = '';
  progress: number = 0;
  isLoading = true;
  error: string | null = null;
  message: string | null = null;
  private progressSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scanService: ScanService,
    private websocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.scanId = this.route.snapshot.paramMap.get('scanId') || '';
    if (this.scanId) {
      this.startProgressCheck();
      this.listenToWebSocket();
    } else {
      this.error = 'ID de scan non fourni. Veuillez relancer le scan.';
      this.isLoading = false;
    }
  }

  startProgressCheck(): void {
    this.progressSubscription = interval(2000)
      .pipe(switchMap(() => this.scanService.getScanProgress(this.scanId)))
      .subscribe({
        next: (progress) => {
          this.progress = progress;
          this.isLoading = false;
          if (progress >= 100) {
            this.progressSubscription?.unsubscribe();
            this.router.navigate(['/report-view', this.scanId]);
          }
        },
        error: (err) => {
          this.error = err.error?.error || 'Erreur lors de la vérification de la progression';
          this.isLoading = false;
        }
      });
  }

  listenToWebSocket(): void {
    this.websocketService.subscribeToScanUpdates((update) => {
      if (update.scanId === this.scanId) {
        this.message = update.message;
        if (update.message?.includes('Scan terminé')) {
          this.progress = 100;
          this.progressSubscription?.unsubscribe();
          this.router.navigate(['/report-view', this.scanId]);
        } else if (update.message?.includes('Erreur')) {
          this.error = update.message;
          this.isLoading = false;
          this.progressSubscription?.unsubscribe();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.progressSubscription?.unsubscribe();
    this.websocketService.disconnect();
  }
}