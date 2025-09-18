import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovisionnementsComponent } from './add-approvisionnements.component';

describe('AddApprovisionnementsComponent', () => {
  let component: AddApprovisionnementsComponent;
  let fixture: ComponentFixture<AddApprovisionnementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddApprovisionnementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApprovisionnementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
