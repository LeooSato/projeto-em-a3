import { Component, OnInit } from '@angular/core';
import { supabase } from '../../../environment/supabase.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; // Importar RouterModule

@Component({
  selector: 'app-visualizar-relatorios',
  templateUrl: './visualizar-relatorios.component.html',
  styleUrls: ['./visualizar-relatorios.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Adicione o RouterModule aqui
})
export class VisualizarRelatoriosComponent implements OnInit {
  relatorios: any[] = [];
  user: any;
  errorMessage: string = '';

  constructor() {}

  async ngOnInit() {
    this.carregarUsuario();
    if (this.user) {
      console.log('Usuário logado:', this.user); // Log para verificar o usuário e área
      await this.carregarRelatorios();
    }
  }

  carregarUsuario() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);

      // Log para verificar se o `area_id` está definido
      console.log('Dados do usuário:', this.user);

      // Verificação adicional para moderadores sem `area_id`
      if (!this.user.area_id && this.user.role === 'moderator') {
        this.errorMessage = 'Moderador não possui uma área vinculada.';
      }
    } else {
      this.errorMessage = 'Usuário não autenticado. Faça login novamente.';
    }
  }

  async carregarRelatorios() {
    try {
      let query = supabase.from('relatorios').select(`
        id, name, created_at, user_id, area_id,
        users (name),
        areas (name)
      `);

      // Filtrar relatórios conforme o papel do usuário
      if (this.user.role === 'common') {
        query = query.eq('user_id', this.user.id);
      } else if (this.user.role === 'moderator') {
        if (!this.user.area_id) {
          this.errorMessage = 'Moderador não possui uma área vinculada.';
          return;
        }
        query = query.eq('area_id', this.user.area_id);
      }

      const { data, error } = await query;

      if (error) {
        this.errorMessage = `Erro ao carregar relatórios: ${error.message}`;
      } else {
        this.relatorios = data || [];
      }
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      this.errorMessage = 'Erro inesperado ao carregar relatórios.';
    }
  }
}
