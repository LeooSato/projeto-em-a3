import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { supabase } from '../../../environment/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent implements OnInit {
  // Propriedades relacionadas ao cadastro de usuários
  email: string = '';
  password: string = '';
  name: string = '';
  role: string = 'common';
  areaId: string = '';
  areas: any[] = [];
  successMessage: string = '';
  errorMessage: string = '';

  // Propriedades relacionadas ao cadastro de áreas
  areaName: string = '';
  areaDescription: string = '';
  areaSuccessMessage: string = '';
  areaErrorMessage: string = '';

  // Usuário logado
  user: any = null;

  constructor(private router: Router) {}

  async ngOnInit() {
    this.loadUser();
    await this.loadAreas();
  }

  loadUser() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async loadAreas() {
    try {
      const { data, error } = await supabase.from('areas').select('*');
      if (error) {
        this.errorMessage = `Erro ao carregar áreas: ${error.message}`;
        return;
      }
      this.areas = data || [];
    } catch (err) {
      this.errorMessage = 'Erro inesperado ao carregar áreas.';
      console.error(err);
    }
  }

  async registerUser() {
    try {
      if (this.role !== 'admin' && !this.areaId) {
        this.errorMessage = 'Moderadores e usuários comuns precisam estar vinculados a uma área.';
        return;
      }

      const hashedPassword = await this.hashPassword(this.password);

      const { error } = await supabase.from('users').insert([
        {
          email: this.email,
          password: hashedPassword,
          name: this.name,
          role: this.role,
          area_id: this.role === 'admin' ? null : this.areaId,
        },
      ]);

      if (error) {
        this.errorMessage = `Erro ao registrar usuário: ${error.message}`;
        return;
      }

      this.successMessage = 'Usuário registrado com sucesso!';
      this.errorMessage = '';
      this.resetUserForm();
    } catch (err) {
      this.errorMessage = 'Erro inesperado ao tentar registrar o usuário.';
      console.error(err);
    }
  }

  resetUserForm() {
    this.email = '';
    this.password = '';
    this.name = '';
    this.role = 'common';
    this.areaId = '';
  }

  async registerArea() {
    try {
      if (!this.areaName.trim()) {
        this.areaErrorMessage = 'O nome da área é obrigatório.';
        return;
      }

      const { error } = await supabase.from('areas').insert([
        {
          name: this.areaName,
          description: this.areaDescription,
        },
      ]);

      if (error) {
        this.areaErrorMessage = `Erro ao registrar área: ${error.message}`;
        return;
      }

      this.areaSuccessMessage = 'Área registrada com sucesso!';
      this.areaErrorMessage = '';
      this.areaName = '';
      this.areaDescription = '';
      await this.loadAreas();
    } catch (err) {
      this.areaErrorMessage = 'Erro inesperado ao tentar registrar a área.';
      console.error(err);
    }
  }

  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
