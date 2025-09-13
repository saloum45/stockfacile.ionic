import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionVenteAchat } from './evolution-vente-achat';

describe('EvolutionVenteAchat', () => {
  let component: EvolutionVenteAchat;
  let fixture: ComponentFixture<EvolutionVenteAchat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvolutionVenteAchat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvolutionVenteAchat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
