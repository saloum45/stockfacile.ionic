import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVentesComponent } from './add-ventes.component';

describe('AddVentesComponent', () => {
  let component: AddVentesComponent;
  let fixture: ComponentFixture<AddVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
