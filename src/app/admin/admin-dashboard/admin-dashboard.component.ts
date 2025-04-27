import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // Removed RouterLink
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Erreur lors de la récupération des utilisateurs';
        this.isLoading = false;
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}