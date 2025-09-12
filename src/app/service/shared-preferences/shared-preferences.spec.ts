import { TestBed } from '@angular/core/testing';

import { SharedPreferences } from './shared-preferences';

describe('SharedPreferences', () => {
  let service: SharedPreferences;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedPreferences);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
