import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
}

export interface Scan {
  id: string;
  url: string;
  statutAnalyse: string;
  dateSoumission: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/users/${userId}`);
  }

  getUserScans(userId: string): Observable<Scan[]> {
    return this.http.get<Scan[]>(`${this.baseUrl}/admin/users/${userId}/scans`);
  }
}