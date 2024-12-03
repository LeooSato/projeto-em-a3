import { TestBed } from '@angular/core/testing';

import { RiskSelectionService } from './risk-selection.service';

describe('RiskSelectionService', () => {
  let service: RiskSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
