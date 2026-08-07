import { TestBed } from '@angular/core/testing';

import { MedicalRecord } from './medical-record';

describe('MedicalRecord', () => {
  let service: MedicalRecord;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalRecord);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
