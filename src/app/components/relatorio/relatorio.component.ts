import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RiskSelectionService } from '../../service/risk-selection.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import annotationPlugin from 'chartjs-plugin-annotation';
import { supabase } from '../../../environment/supabase.service';
import { ActivatedRoute } from '@angular/router';

Chart.register(annotationPlugin);
Chart.register(...registerables);

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],imports: [CommonModule, ReactiveFormsModule]
})
export class RelatorioComponent implements OnInit {
  relatorioId: string | null = null; // ID do relatório atual
  selectedRiscosData: any[] = []; // Dados dos riscos associados
  errorMessage: string = ''; // Mensagem de erro

  constructor(
    private route: ActivatedRoute,
    private riskSelectionService: RiskSelectionService
  ) {}

  async ngOnInit() {
    // Passo 1: Recuperar o ID do relatório da rota
    this.relatorioId = this.route.snapshot.paramMap.get('id');

    if (this.relatorioId) {
      // Carregar os riscos associados ao relatório específico
      await this.carregarRiscos();
    } else {
      // Caso os riscos estejam no serviço, use-os diretamente
      this.selectedRiscosData = this.riskSelectionService.getSelectedRiscos();
      if (this.selectedRiscosData.length === 0) {
        this.errorMessage = 'Nenhum risco selecionado ou relatório encontrado.';
        return;
      }
    }

    // Gerar Matriz de Risco
    if (this.selectedRiscosData.length > 0) {
      this.generateRiskMatrix();
    }
  }

  // Carrega os riscos associados a um relatório específico
  async carregarRiscos() {
    try {
      const { data, error } = await supabase
        .from('relatorio_riscos')
        .select(`
          riscos:matriz_riscos(*)
        `)
        .eq('relatorio_id', this.relatorioId);

      if (error) {
        this.errorMessage = `Erro ao carregar riscos: ${error.message}`;
        return;
      }

      // Mapear os dados para exibição
      this.selectedRiscosData = (data || []).map((item) => item.riscos);
    } catch (err) {
      console.error('Erro ao carregar riscos:', err);
      this.errorMessage = 'Erro inesperado ao carregar riscos.';
    }
  }

  // Gera a Matriz de Risco
  generateRiskMatrix() {
    const ctx = document.getElementById('riskMatrixChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas para Matriz de Risco não encontrado.');
      return;
    }

    const data = this.selectedRiscosData.map((risco) => ({
      x: risco.impacto,
      y: risco.probabilidade,
      r: 10, // Tamanho da bolha
    }));
  
    new Chart(ctx, {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'Riscos',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.5)', // Bolhas dos riscos
          },
        ],
      },
      options: {
        plugins: {
          annotation: {
            annotations: [
              // Baixa - Insignificante (Verde)
              {
                type: 'box',
                xMin: 0,
                xMax: 1.5,
                yMin: 0,
                yMax: 1.5,
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'rgba(0, 255, 0, 0.5)',
                borderWidth: 1,
              },
              // Baixa - Moderado (Verde)
              {
                type: 'box',
                xMin: 1.5,
                xMax: 3,
                yMin: 0,
                yMax: 1.5,
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'rgba(0, 255, 0, 0.5)',
                borderWidth: 1,
              },
              // Baixa - Catastrófico (Amarelo)
              {
                type: 'box',
                xMin: 3,
                xMax: 5,
                yMin: 0,
                yMax: 1.5,
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
                borderColor: 'rgba(255, 255, 0, 0.5)',
                borderWidth: 1,
              },
              // Média - Insignificante (Verde)
              {
                type: 'box',
                xMin: 0,
                xMax: 1.5,
                yMin: 1.5,
                yMax: 3,
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                borderColor: 'rgba(0, 255, 0, 0.5)',
                borderWidth: 1,
              },
              // Média - Moderado (Amarelo)
              {
                type: 'box',
                xMin: 1.5,
                xMax: 3,
                yMin: 1.5,
                yMax: 3,
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
                borderColor: 'rgba(255, 255, 0, 0.5)',
                borderWidth: 1,
              },
              // Média - Catastrófico (Vermelho)
              {
                type: 'box',
                xMin: 3,
                xMax: 5,
                yMin: 1.5,
                yMax: 3,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 0.5)',
                borderWidth: 1,
              },
              // Alta - Insignificante (Amarelo)
              {
                type: 'box',
                xMin: 0,
                xMax: 1.5,
                yMin: 3,
                yMax: 5,
                backgroundColor: 'rgba(255, 255, 0, 0.2)',
                borderColor: 'rgba(255, 255, 0, 0.5)',
                borderWidth: 1,
              },
              // Alta - Moderado (Vermelho)
              {
                type: 'box',
                xMin: 1.5,
                xMax: 3,
                yMin: 3,
                yMax: 5,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 0.5)',
                borderWidth: 1,
              },
              // Alta - Catastrófico (Vermelho)
              {
                type: 'box',
                xMin: 3,
                xMax: 5,
                yMin: 3,
                yMax: 5,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 0.5)',
                borderWidth: 1,
              },
            ],
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Impacto' },
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                if (value === 0) return 'Insignificante';
                if (value === 2) return 'Moderado';
                if (value === 4) return 'Catastrófico';
                return '';
              },
            },
          },
          y: {
            title: { display: true, text: 'Probabilidade' },
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              callback: (value) => {
                if (value === 0) return 'Baixa';
                if (value === 2) return 'Média';
                if (value === 4) return 'Alta';
                return '';
              },
            },
          },
        },
      },
    });
  }
  
  
}
