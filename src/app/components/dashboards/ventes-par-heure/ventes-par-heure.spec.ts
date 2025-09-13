import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentesParHeure } from './ventes-par-heure';

describe('VentesParHeure', () => {
  let component: VentesParHeure;
  let fixture: ComponentFixture<VentesParHeure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentesParHeure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentesParHeure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
