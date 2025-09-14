import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovisionnementsPage } from './approvisionnements.page';

describe('ApprovisionnementsPage', () => {
  let component: ApprovisionnementsPage;
  let fixture: ComponentFixture<ApprovisionnementsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovisionnementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
