import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcomptesComponent } from './edit-acomptes.component';

describe('EditAcomptesComponent', () => {
  let component: EditAcomptesComponent;
  let fixture: ComponentFixture<EditAcomptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAcomptesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAcomptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
