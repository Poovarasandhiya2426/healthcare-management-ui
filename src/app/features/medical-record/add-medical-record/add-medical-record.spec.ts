import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicalRecord } from './add-medical-record';

describe('AddMedicalRecord', () => {
  let component: AddMedicalRecord;
  let fixture: ComponentFixture<AddMedicalRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMedicalRecord],
    }).compileComponents();

    fixture = TestBed.createComponent(AddMedicalRecord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
