import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Para navegação após login
import { supabase } from '../../../environment/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  email: string = ''; // Campo de email
  password: string = ''; // Campo de senha
  errorMessage: string = ''; // Mensagem de erro
  successMessage: string = ''; // Mensagem de sucesso

  constructor(private router: Router) {}

  // Método de login
  async login() {
    try {
      // Buscar o usuário pelo email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', this.email)
        .single();

      if (error || !user) {
        this.errorMessage = 'Email ou senha inválidos.';
        this.successMessage = '';
        return;
      }

      // Verificar a senha
      const hashedInputPassword = await this.hashPassword(this.password);
      if (hashedInputPassword !== user.password) {
        this.errorMessage = 'Email ou senha inválidos.';
        this.successMessage = '';
        return;
      }

      // Login bem-sucedido
      this.successMessage = 'Login realizado com sucesso!';
      this.errorMessage = '';

      // Armazenar informações do usuário localmente
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: user.id,
          name: user.name,
          role: user.role,
          areaId: user.area_id,
        })
      );

      // Redirecionar com base no papel do usuário
      this.router.navigate(['/dashboard']);

    } catch (err) {
      this.errorMessage = 'Erro inesperado ao tentar login.';
      this.successMessage = '';
      console.error(err);
    }
  }

  // Método para hashear a senha (simulação de hash)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
}
