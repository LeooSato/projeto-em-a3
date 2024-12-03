import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarRelatoriosComponent } from './visualizar-relatorios.component';

describe('VisualizarRelatoriosComponent', () => {
  let component: VisualizarRelatoriosComponent;
  let fixture: ComponentFixture<VisualizarRelatoriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisualizarRelatoriosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarRelatoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
