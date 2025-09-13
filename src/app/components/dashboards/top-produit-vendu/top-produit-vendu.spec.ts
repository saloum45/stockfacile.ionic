import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopProduitVendu } from './top-produit-vendu';

describe('TopProduitVendu', () => {
  let component: TopProduitVendu;
  let fixture: ComponentFixture<TopProduitVendu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopProduitVendu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopProduitVendu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
