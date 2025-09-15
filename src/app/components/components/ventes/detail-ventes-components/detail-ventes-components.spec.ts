import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVentesComponents } from './detail-ventes-components';

describe('DetailVentesComponents', () => {
  let component: DetailVentesComponents;
  let fixture: ComponentFixture<DetailVentesComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailVentesComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailVentesComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
