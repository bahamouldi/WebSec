import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { email: '', motDePasse: '' };
  error: string | null = null;
  message: string | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.message = params['message'] || null;
    });
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      this.error = 'Veuillez remplir tous les champs correctement';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response.body) {
          const role = response.body.utilisateur.role.replace('ROLE_', '');
          const targetRoute = role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
          this.router.navigate([targetRoute]).then(() => {
            this.isLoading = false;
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.message || 'Erreur lors de la connexion';
      }
    });
  }
}