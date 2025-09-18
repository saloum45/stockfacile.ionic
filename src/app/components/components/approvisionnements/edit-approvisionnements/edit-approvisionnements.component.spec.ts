import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditApprovisionnementsComponent } from './edit-approvisionnements.component';

describe('EditApprovisionnementsComponent', () => {
  let component: EditApprovisionnementsComponent;
  let fixture: ComponentFixture<EditApprovisionnementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditApprovisionnementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditApprovisionnementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
