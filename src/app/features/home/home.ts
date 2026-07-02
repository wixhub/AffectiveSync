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
  isDragging = signal<boolean>(false);

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

  // Handle dropped files and update the selectedFile signal
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);

    if (event.dataTransfer?.files?.[0]) {
      this.selectedFile.set(event.dataTransfer.files[0]);
    }
  }

  // Handle file selection from the browser dialog
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }
}
