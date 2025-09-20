import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventairesPage } from './inventaires.page';

describe('InventairesPage', () => {
  let component: InventairesPage;
  let fixture: ComponentFixture<InventairesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InventairesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
