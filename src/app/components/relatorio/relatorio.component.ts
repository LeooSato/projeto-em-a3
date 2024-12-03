import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RiskSelectionService } from '../../service/risk-selection.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);
Chart.register(...registerables);

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.css'],imports: [CommonModule, ReactiveFormsModule]
})
export class RelatorioComponent implements OnInit {
  selectedRiscosData: any[] = [];

  constructor(private riskSelectionService: RiskSelectionService) {}

  ngOnInit() {
    // Passo 1: Recuperar dados do serviço
    this.selectedRiscosData = this.riskSelectionService.getSelectedRiscos();
    console.log('Passo 1: Riscos recuperados do serviço:', this.selectedRiscosData);

    // Verificar se os dados estão vazios
    if (this.selectedRiscosData.length === 0) {
      console.error('Nenhum risco selecionado foi encontrado. Verifique o serviço ou a origem dos dados.');
      return;
    }

    // Passo 2: Verificar estrutura dos dados
    this.selectedRiscosData.forEach((risco, index) => {
      console.log(`Passo 2: Verificando estrutura do risco ${index + 1}`, risco);
      if (
        typeof risco.probabilidade !== 'number' ||
        typeof risco.impacto !== 'number' ||
        typeof risco.grau_risco_atual !== 'number' ||
        typeof risco.risco_residual !== 'number'
      ) {
        console.error(`O risco ${risco.id} possui valores inválidos ou ausentes.`);
      }
    });

    // Passo 3: Gerar Matriz de Risco
    if (this.selectedRiscosData.length > 0) {
      try {
        this.generateRiskMatrix();
        console.log('Passo 3: Matriz de Risco gerada com sucesso.');
      } catch (error) {
        console.error('Erro ao gerar Matriz de Risco:', error);
      }
    }
  }

  generateRiskMatrix() {
    const ctx = document.getElementById('riskMatrixChart') as HTMLCanvasElement;
  
    if (!ctx) {
      console.error('Canvas para Matriz de Risco não encontrado.');
      return;
    }
  
    const data = this.selectedRiscosData.map((risco) => ({
      x: risco.impacto,
      y: risco.probabilidade,
      r: 10, // Tamanho do ponto
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
