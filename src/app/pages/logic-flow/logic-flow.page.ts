import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogicFlowDesignerComponent } from '../../components/logic-flow-designer/logic-flow-designer.component';

@Component({
  selector: 'app-logic-flow-page',
  standalone: true,
  imports: [CommonModule, LogicFlowDesignerComponent],
  templateUrl: './logic-flow.page.html',
  styleUrl: './logic-flow.page.scss',
})
export class LogicFlowPage {}
