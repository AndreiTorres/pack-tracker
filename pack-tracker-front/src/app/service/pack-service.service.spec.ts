import { TestBed } from '@angular/core/testing';

import { PackServiceService } from './pack-service.service';

describe('PackServiceService', () => {
  let service: PackServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
