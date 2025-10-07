import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BpmnModelerComponent } from '../../components/bpmn-modeler/bpmn-modeler.component';

@Component({
  selector: 'app-bpmn-modeler-page',
  standalone: true,
  imports: [CommonModule, BpmnModelerComponent],
  templateUrl: './bpmn-modeler.page.html',
  styleUrl: './bpmn-modeler.page.scss',
})
export class BpmnModelerPage {}
