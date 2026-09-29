import { Component, inject } from '@angular/core';
import { VideoProcessorService } from '../../services/video-processor.service';

@Component({
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  public processor = inject(VideoProcessorService);
}
