import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcomptesPage } from './acomptes.page';

describe('AcomptesPage', () => {
  let component: AcomptesPage;
  let fixture: ComponentFixture<AcomptesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AcomptesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
