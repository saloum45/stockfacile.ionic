import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProduitsComponent } from './edit-produits.component';

describe('EditProduitsComponent', () => {
  let component: EditProduitsComponent;
  let fixture: ComponentFixture<EditProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProduitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
