import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // Signals for reactive state management of the file upload process
  selectedFile = signal<File | null>(null);

  uploadProgress = signal<number>(0); // Progress from 0 to 100
  isUploading = signal<boolean>(false);

  isDragging = signal<boolean>(false);
  // Define allowed video formats for scientific analysis
  private readonly ALLOWED_TYPES = [
    'video/mp4',
    'video/x-matroska',
    'video/webm',
  ];

  // Simulate upload process
  startAnalysis() {
    this.isUploading.set(true);
    this.uploadProgress.set(0);

    const interval = setInterval(() => {
      this.uploadProgress.update((v) => {
        if (v >= 100) {
          clearInterval(interval);
          this.isUploading.set(false);
          return 100;
        }
        return v + 10; // Increase progress
      });
    }, 200);
  }

  private handleFile(file: File) {
    // Check if the file type is in our allowed list
    if (this.ALLOWED_TYPES.includes(file.type)) {
      this.selectedFile.set(file);
    } else {
      alert(
        'Unsupported file format. Please upload a valid video file (.mp4, .mkv, .webm).',
      );
      this.selectedFile.set(null);
    }
  }

  // Update handlers to use the new validation logic
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);

    if (event.dataTransfer?.files?.[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  // Handle drag over event to provide visual feedback
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  // Handle drag leave event to reset visual feedback
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
  }
}
