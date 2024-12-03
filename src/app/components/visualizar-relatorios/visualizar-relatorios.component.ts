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
      await this.carregarRelatorios();
    }
  }

  carregarUsuario() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
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
