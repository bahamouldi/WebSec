import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Add this import
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Add RouterModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { nom: '', email: '', motDePasse: '', confirmMotDePasse: '' };
  error: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    // Validate password length
    if (this.user.motDePasse.length < 8) {
      this.error = 'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }
  
    // Validate that passwords match
    if (this.user.motDePasse !== this.user.confirmMotDePasse) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }
  
    this.isLoading = true;
    this.error = null;
  
    const { confirmMotDePasse, ...userData } = this.user;
    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login'], { queryParams: { message: 'Inscription réussie, veuillez vous connecter' } });
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || "Erreur lors de l'inscription";
      }
    });
  }
}