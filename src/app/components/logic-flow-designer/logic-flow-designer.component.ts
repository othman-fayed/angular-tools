import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import LogicFlow from '@logicflow/core';

type NodeConfig = LogicFlow.NodeConfig;
type EdgeConfig = LogicFlow.EdgeConfig;

@Component({
  selector: 'app-logic-flow-designer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logic-flow-designer.component.html',
  styleUrl: './logic-flow-designer.component.scss',
})
export class LogicFlowDesignerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true })
  private containerRef!: ElementRef<HTMLDivElement>;

  private lf: LogicFlow | null = null;
  private readonly teardownCallbacks: Array<() => void> = [];
  private nodeSequence = 1;

  protected selectedNode: NodeConfig | null = null;
  protected nodeLabel = '';

  constructor(private readonly ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initializeLogicFlow();
  }

  ngOnDestroy(): void {
    this.teardownCallbacks.forEach((fn) => fn());
    this.teardownCallbacks.length = 0;
    this.lf?.destroy();
    this.lf = null;
  }

  private initializeLogicFlow(): void {
    this.ngZone.runOutsideAngular(() => {
      this.lf = new LogicFlow({
        container: this.containerRef.nativeElement,
        grid: true,
        background: {
          color: '#f8f9fa',
        },
      });

      const nodes: NodeConfig[] = [
        { id: 'start', type: 'circle', x: 120, y: 180, text: 'Start' },
        { id: 'task', type: 'rect', x: 340, y: 180, text: 'Review' },
        { id: 'decision', type: 'diamond', x: 560, y: 180, text: 'Approved?' },
        { id: 'end', type: 'circle', x: 780, y: 180, text: 'End' },
      ];

      const edges: EdgeConfig[] = [
        { id: 'e1', type: 'polyline', sourceNodeId: 'start', targetNodeId: 'task' },
        { id: 'e2', type: 'polyline', sourceNodeId: 'task', targetNodeId: 'decision' },
        {
          id: 'e3',
          type: 'polyline',
          sourceNodeId: 'decision',
          targetNodeId: 'end',
          text: 'Yes',
        },
        {
          id: 'e4',
          type: 'polyline',
          sourceNodeId: 'decision',
          targetNodeId: 'task',
          text: 'No',
        },
      ];

      this.lf.render({ nodes, edges });

      const nodeClickHandler = (event: { data: NodeConfig }) => {
        this.ngZone.run(() => {
          this.selectNode(event.data);
        });
      };

      const blankClickHandler = () => {
        this.ngZone.run(() => {
          this.clearSelection();
        });
      };

      this.lf.on('node:click', nodeClickHandler);
      this.lf.on('blank:click', blankClickHandler);

      this.teardownCallbacks.push(() => {
        this.lf?.off('node:click', nodeClickHandler);
        this.lf?.off('blank:click', blankClickHandler);
      });
    });
  }

  protected addNode(type: NodeConfig['type']): void {
    if (!this.lf) {
      return;
    }

    const index = this.nodeSequence++;
    const column = index % 4;
    const row = Math.floor(index / 4);

    const x = 160 + column * 180;
    const y = 140 + row * 140;

    const id = `${type}-${Date.now()}-${index}`;
    const text = this.getNodeLabelForType(type);

    this.lf.addNode({ id, type, x, y, text });
    this.lf.selectElementById(id);

    this.selectNode({ id, type, x, y, text });
  }

  protected updateSelectedNodeLabel(): void {
    if (!this.lf || !this.selectedNode) {
      return;
    }

    const trimmed = this.nodeLabel.trim();
    const label = trimmed.length > 0 ? trimmed : 'Untitled Node';

    this.lf.updateText(this.selectedNode.id, label);
    this.selectedNode = {
      ...this.selectedNode,
      text: label,
    };
    this.nodeLabel = label;
  }

  protected deleteSelectedNode(): void {
    if (!this.lf || !this.selectedNode) {
      return;
    }

    this.lf.deleteNode(this.selectedNode.id);
    this.clearSelection();
  }

  private selectNode(node: NodeConfig): void {
    this.selectedNode = node;
    const text = this.resolveNodeText(node);
    this.nodeLabel = text;
  }

  private clearSelection(): void {
    this.selectedNode = null;
    this.nodeLabel = '';
  }

  private resolveNodeText(node: NodeConfig): string {
    const { text } = node;
    if (typeof text === 'string') {
      return text;
    }

    if (text && typeof text === 'object' && 'value' in text) {
      return String(text.value ?? '');
    }

    return '';
  }

  private getNodeLabelForType(type: NodeConfig['type']): string {
    switch (type) {
      case 'circle':
        return 'Decision Point';
      case 'diamond':
        return 'Gateway';
      case 'rect':
      default:
        return 'Task';
    }
  }
}
