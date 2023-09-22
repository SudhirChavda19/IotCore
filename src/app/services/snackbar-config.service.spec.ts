import { TestBed } from '@angular/core/testing';

import { SnackbarConfigService } from './snackbar-config.service';

describe('SnackbarConfigService', () => {
  let service: SnackbarConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnackbarConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
