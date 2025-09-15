import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAcomptesComponent } from './add-acomptes.component';

describe('AddAcomptesComponent', () => {
  let component: AddAcomptesComponent;
  let fixture: ComponentFixture<AddAcomptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAcomptesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAcomptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
