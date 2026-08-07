import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBilling } from './add-billing';

describe('AddBilling', () => {
  let component: AddBilling;
  let fixture: ComponentFixture<AddBilling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBilling],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBilling);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
