import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, Scan } from '../../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-scans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-scans.component.html' // Removed styleUrls since CSS file is missing
})
export class UserScansComponent implements OnInit {
  userId: string | null = null;
  scans: Scan[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.userService.getUserScans(this.userId).subscribe({
        next: (data: Scan[]) => {
          this.scans = data;
          this.isLoading = false;
        },
        error: () => {
          this.error = 'Erreur lors de la récupération des scans';
          this.isLoading = false;
        }
      });
    }
  }
}