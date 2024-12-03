import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { supabase } from '../../../environment/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matriz',
  standalone: true,
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class MatrizComponent implements OnInit {
  matrizForm: FormGroup;
  riscos: any[] = [];
  areas: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  areaId: string | null = null; // Adiciona a área do usuário

  constructor(private fb: FormBuilder) {
    const user = localStorage.getItem('user');
    this.areaId = user ? JSON.parse(user).areaId : null; // Obtém a área do usuário logado

    this.matrizForm = this.fb.group({
      risco: ['', Validators.required],
      probabilidade: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      justificativa_probabilidade: ['', Validators.required],
      impacto: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      justificativa_impacto: ['', Validators.required],
      facilidade_deteccao: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      justificativa_deteccao: ['', Validators.required],
      plano_resposta: [''],
      notas: [''],
      area_id: [this.areaId, Validators.required], // Inclui a área
    });
  }

  async ngOnInit() {
    await this.loadAreas();
    await this.loadRiscos();
  }

  // Carregar áreas para o formulário
  async loadAreas() {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*')
        .eq('id', this.areaId); // Filtra pela área do usuário logado
  
      if (error) {
        this.errorMessage = `Erro ao carregar áreas: ${error.message}`;
      } else {
        this.areas = data || [];
      }
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Erro inesperado ao carregar áreas.';
    }
  }
  async removerRisco(riscoId: number) {
    if (confirm('Tem certeza que deseja remover este risco?')) {
      try {
        // Chamada para remover o risco do banco
        const { error } = await supabase.from('matriz_riscos').delete().eq('id', riscoId);
  
        if (error) {
          this.errorMessage = `Erro ao remover risco: ${error.message}`;
        } else {
          this.successMessage = 'Risco removido com sucesso!';
          this.riscos = this.riscos.filter((risco) => risco.id !== riscoId); // Remove da tabela localmente
        }
      } catch (err) {
        console.error(err);
        this.errorMessage = 'Erro inesperado ao remover risco.';
      }
    }
  }

  // Carregar riscos cadastrados e filtrar pela área do usuário
  async loadRiscos() {
    try {
      const { data, error } = await supabase
        .from('matriz_riscos')
        .select('*, areas(name)')
        .eq('area_id', this.areaId); // Filtra os riscos pela área do usuário

      if (error) {
        this.errorMessage = `Erro ao carregar riscos: ${error.message}`;
      } else {
        this.riscos = data.map((risco) => ({
          ...risco,
          area_name: risco.areas?.name || 'Área não especificada',
          plano_resposta: risco.plano_resposta || this.gerarPlanoDeResposta(risco.grau_risco_atual),
          notas: risco.notas || 'Sem observações',
        }));
      }
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Erro inesperado ao carregar riscos.';
    }
  }

  // Gerar plano de resposta automático
  gerarPlanoDeResposta(grauRisco: number): string {
    if (grauRisco >= 33) return 'Plano crítico: Redirecionar recursos imediatamente.';
    if (grauRisco >= 25) return 'Ações prioritárias devem ser implementadas em breve.';
    if (grauRisco >= 17) return 'Planejar ações preventivas moderadas.';
    if (grauRisco >= 8) return 'Monitorar e revisar periodicamente.';
    return 'Nenhuma ação necessária.';
  }

  // Cadastrar novo risco
  async submitRisco() {
    if (this.matrizForm.invalid) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    const formValue = this.matrizForm.value;
    const grauRiscoAtual =
      (formValue.probabilidade * formValue.impacto) / formValue.facilidade_deteccao;

    const planoResposta = formValue.plano_resposta || this.gerarPlanoDeResposta(grauRiscoAtual);

    const riscoData = {
      ...formValue,
      grau_risco_atual: Math.round(grauRiscoAtual),
      plano_resposta: planoResposta,
    };

    try {
      const { error } = await supabase.from('matriz_riscos').insert([riscoData]);

      if (error) {
        this.errorMessage = `Erro ao cadastrar risco: ${error.message}`;
      } else {
        this.successMessage = 'Risco cadastrado com sucesso!';
        this.matrizForm.reset();
        await this.loadRiscos();
      }
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Erro inesperado ao cadastrar risco.';
    }
    
  }
  
}
