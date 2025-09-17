import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsClient } from './details-client';

describe('DetailsClient', () => {
  let component: DetailsClient;
  let fixture: ComponentFixture<DetailsClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
