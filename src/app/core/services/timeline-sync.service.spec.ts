import { TestBed } from '@angular/core/testing';

import { TimelineSyncService } from './timeline-sync.service';

describe('TimelineSyncService', () => {
  let service: TimelineSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
