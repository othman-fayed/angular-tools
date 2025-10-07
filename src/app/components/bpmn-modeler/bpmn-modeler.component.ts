import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from 'bpmn-js-properties-panel';

const INITIAL_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="186" y="152" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

@Component({
  selector: 'app-bpmn-modeler',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bpmn-modeler.component.html',
  styleUrl: './bpmn-modeler.component.scss',
})
export class BpmnModelerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef<HTMLDivElement>;

  @ViewChild('properties', { static: true })
  private propertiesRef!: ElementRef<HTMLDivElement>;

  private modeler: BpmnModeler | null = null;

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initializeModeler();
  }

  ngOnDestroy(): void {
    this.modeler?.destroy();
    this.modeler = null;
  }

  private initializeModeler(): void {
    this.ngZone.runOutsideAngular(async () => {
      this.modeler = new BpmnModeler({
        container: this.canvasRef.nativeElement,
        keyboard: {
          bindTo: document,
        },
        propertiesPanel: {
          parent: this.propertiesRef.nativeElement,
        },
        additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
      });

      try {
        await this.modeler.importXML(INITIAL_DIAGRAM);
      } catch (error) {
        console.error('Failed to load BPMN diagram', error);
      }
    });
  }
}
