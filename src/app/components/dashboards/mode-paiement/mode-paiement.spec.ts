import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModePaiement } from './mode-paiement';

describe('ModePaiement', () => {
  let component: ModePaiement;
  let fixture: ComponentFixture<ModePaiement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModePaiement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModePaiement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
