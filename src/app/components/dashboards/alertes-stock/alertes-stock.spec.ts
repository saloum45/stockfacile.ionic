import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertesStock } from './alertes-stock';

describe('AlertesStock', () => {
  let component: AlertesStock;
  let fixture: ComponentFixture<AlertesStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertesStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertesStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
