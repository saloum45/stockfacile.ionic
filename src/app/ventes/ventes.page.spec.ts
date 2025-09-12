import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentesPage } from './ventes.page';

describe('VentesPage', () => {
  let component: VentesPage;
  let fixture: ComponentFixture<VentesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VentesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
