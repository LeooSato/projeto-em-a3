import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RiskSelectionService {
  private selectedRiscos: any[] = []; // Array para armazenar os riscos selecionados

  // Método para salvar os riscos selecionados
  setSelectedRiscos(riscos: any[]) {
    this.selectedRiscos = riscos;
  }

  // Método para obter os riscos selecionados
  getSelectedRiscos() {
    return this.selectedRiscos;
  }
}
