import { TestBed } from '@angular/core/testing';

import { VideoProcessorService } from './video-processor.service';

describe('VideoProcessorService', () => {
  let service: VideoProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
