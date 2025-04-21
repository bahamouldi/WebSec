import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { UserService, User } from '../../user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string | null = null;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.userService.getCurrentUser().subscribe({
        next: (user: User) => {
          this.userName = user.nom || 'Utilisateur';
        },
        error: (err: HttpErrorResponse) => {
          this.userName = 'Utilisateur';
          console.error('Erreur lors de la récupération de l’utilisateur:', err);
        }
      });
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}