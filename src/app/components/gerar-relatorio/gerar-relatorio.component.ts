import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { supabase } from '../../../environment/supabase.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RiskSelectionService } from '../../service/risk-selection.service';


@Component({
  selector: 'app-gerar-relatorio',
  standalone: true,
  templateUrl: './gerar-relatorio.component.html',
  styleUrls: ['./gerar-relatorio.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class GerarRelatorioComponent implements OnInit {
  relatorioForm: FormGroup;
  riscos: any[] = [];
  selectedRiscos: number[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  user: any;
  areaId: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private riskSelectionService: RiskSelectionService
  ) {
    this.relatorioForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.carregarUsuario();

    if (this.areaId) {
      await this.carregarRiscos();
    }
  }

  carregarUsuario() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.user = userData;
      this.areaId = userData.areaId;
    } else {
      this.errorMessage = 'Usuário não autenticado. Faça login novamente.';
      this.successMessage = '';
    }
  }

  async carregarRiscos() {
    try {
      const { data: riscos, error } = await supabase
        .from('matriz_riscos')
        .select('*')
        .eq('area_id', this.areaId);

      if (error) {
        this.errorMessage = `Erro ao carregar riscos: ${error.message}`;
      } else {
        this.riscos = riscos || [];
      }
    } catch (err) {
      console.error('Erro ao carregar riscos:', err);
      this.errorMessage = 'Erro inesperado ao carregar riscos.';
    }
  }

  toggleRisco(riscoId: number) {
    if (this.selectedRiscos.includes(riscoId)) {
      this.selectedRiscos = this.selectedRiscos.filter((id) => id !== riscoId);
    } else {
      this.selectedRiscos.push(riscoId);
    }
  }

  async criarRelatorio() {
    if (this.relatorioForm.invalid || this.selectedRiscos.length === 0) {
      this.errorMessage =
        'Por favor, preencha o nome do relatório e selecione pelo menos um risco.';
      return;
    }

    const relatorioData = {
      name: this.relatorioForm.value.name,
      area_id: this.areaId,
      user_id: this.user.id,
    };

    try {
      const { data: relatorio, error: relatorioError } = await supabase
        .from('relatorios')
        .insert([relatorioData])
        .select('id')
        .single();

      if (relatorioError) {
        this.errorMessage = `Erro ao criar relatório: ${relatorioError.message}`;
        return;
      }

      const relatorioRiscos = this.selectedRiscos.map((riscoId) => ({
        relatorio_id: relatorio.id,
        risco_id: riscoId,
      }));

      const { error: riscoError } = await supabase
        .from('relatorio_riscos')
        .insert(relatorioRiscos);

      if (riscoError) {
        this.errorMessage = `Erro ao associar riscos ao relatório: ${riscoError.message}`;
      } else {
        // Salvar os riscos selecionados no serviço
        const riscosSelecionados = this.riscos.filter((risco) =>
          this.selectedRiscos.includes(risco.id)
        );
        this.riskSelectionService.setSelectedRiscos(riscosSelecionados);

        // Redirecionar para a tela de relatório
        this.successMessage = 'Relatório criado com sucesso!';
        this.router.navigate(['/relatorio']);
      }
    } catch (err) {
      console.error('Erro ao criar relatório:', err);
      this.errorMessage = 'Erro inesperado ao criar relatório.';
    }
  }
}
