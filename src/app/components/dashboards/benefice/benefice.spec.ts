import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Benefice } from './benefice';

describe('Benefice', () => {
  let component: Benefice;
  let fixture: ComponentFixture<Benefice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Benefice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Benefice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
