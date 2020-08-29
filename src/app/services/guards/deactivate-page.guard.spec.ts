import { TestBed } from '@angular/core/testing';

import { DeactivatePageGuard } from './deactivate-page.guard';

describe('DeactivatePageGuard', () => {
  let guard: DeactivatePageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DeactivatePageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
