import { TestBed } from '@angular/core/testing';

import { ServiceCepService } from './service-cep.service';

describe('ServiceCepService', () => {
  let service: ServiceCepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
