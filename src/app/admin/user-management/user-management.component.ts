import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../user.service';

interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
  createdAt?: string; // Ajouté pour la date d'inscription
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  showModal = false;
  selectedUserId: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Authentification requise. Veuillez vous reconnecter.';
        } else if (err.status === 403) {
          this.error = 'Accès refusé. Permissions insuffisantes.';
        } else {
          this.error = 'Erreur lors de la récupération des utilisateurs.';
        }
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  openDeleteModal(userId: string): void {
    this.selectedUserId = userId;
    this.showModal = true;
  }

  closeDeleteModal(): void {
    this.showModal = false;
    this.selectedUserId = null;
  }

  confirmDelete(): void {
    if (this.selectedUserId) {
      this.userService.deleteUser(this.selectedUserId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== this.selectedUserId);
          this.closeDeleteModal();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression de l\'utilisateur';
          console.error('Erreur:', err);
        }
      });
    }
  }
}