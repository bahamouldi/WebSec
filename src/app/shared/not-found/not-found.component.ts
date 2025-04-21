import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-8 text-center">
      <h2 class="text-8xl font-bold text-danger animate-404 mb-4">404</h2>
      <h3 class="text-2xl font-semibold text-cyber-blue mb-4">Page non trouvée</h3>
      <p class="text-gray-600 mb-6">La page demandée n'existe pas ou a été déplacée.</p>
      <a [routerLink]="['/dashboard']" class="btn btn-primary inline-flex items-center">
        <i class="bi bi-arrow-left mr-2"></i> Retour au tableau de bord
      </a>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .text-cyber-blue {
      color: #1e3a8a;
    }

    .text-danger {
      color: #b91c1c;
    }

    .btn-primary {
      background-color: #1976d2;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 1rem;
      transition: background-color 0.3s ease;
    }

    .btn-primary:hover {
      background-color: #1565c0;
    }

    .animate-404 {
      animation: shake 0.5s infinite;
    }

    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-2px); }
      100% { transform: translateX(0); }
    }

    @media (max-width: 576px) {
      .text-8xl {
        font-size: 5rem;
      }
    }
  `]
})
export class NotFoundComponent {}