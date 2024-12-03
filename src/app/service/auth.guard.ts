import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('user'); // Verifica se o usuário está logado
    if (user) {
      return true; // Permite acesso
    } else {
      this.router.navigate(['/login']); // Redireciona para a tela de login
      return false; // Bloqueia acesso
    }
  }
}
