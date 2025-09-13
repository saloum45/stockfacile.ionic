import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVentesComponent } from './edit-ventes.component';

describe('EditVentesComponent', () => {
  let component: EditVentesComponent;
  let fixture: ComponentFixture<EditVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
