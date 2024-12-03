import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: any = null; // Armazena o usuário logado
  isAdmin: boolean = false; // Flag para verificar se o usuário é administrador

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.isAdmin = this.user.role === 'admin'; // Verifica se o usuário é administrador
    }
  }
  

  logout() {
    localStorage.removeItem('user');
    this.user = null;
    this.isAdmin = false;
    this.router.navigate(['/login']);
  }
}
