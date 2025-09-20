import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailInventairesComponent } from './list-detail-inventaires.component';

describe('ListDetailInventairesComponent', () => {
  let component: ListDetailInventairesComponent;
  let fixture: ComponentFixture<ListDetailInventairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDetailInventairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDetailInventairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
