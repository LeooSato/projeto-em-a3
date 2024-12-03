import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.verificarUsuario();
  }

  verificarUsuario() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user); // Carrega os dados do usuário logado
    } else {
      this.router.navigate(['/login']); // Redireciona para login se não logado
    }
  }

  logout() {
    localStorage.removeItem('user'); // Remove os dados do localStorage
    this.router.navigate(['/login']); // Redireciona para a tela de login
  }
}
