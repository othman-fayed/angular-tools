import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SequenceDiagramDesignerComponent } from '../../components/sequence-diagram-designer/sequence-diagram-designer.component';

@Component({
  selector: 'app-sequence-designer-page',
  standalone: true,
  imports: [CommonModule, SequenceDiagramDesignerComponent],
  templateUrl: './sequence-designer.page.html',
  styleUrl: './sequence-designer.page.scss',
})
export class SequenceDesignerPage {}
