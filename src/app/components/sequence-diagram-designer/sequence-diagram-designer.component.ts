import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ApplicationLifecyclePhaseDto,
  ApplicationLifecycleSubPhaseDto,
  ApplicationLifecycleState,
} from '../../models/application-lifecycle-phase.dto';

type SequenceNodeType = 'phase' | 'parallel';

type SelectedNode =
  | { type: 'phase'; phaseId: string }
  | { type: 'subPhase'; phaseId: string; subPhaseId: string };

interface SequenceSubPhase extends ApplicationLifecycleSubPhaseDto {
  nodeType: Extract<SequenceNodeType, 'parallel'>;
  successNextPhaseId?: string;
  failureNextPhaseId?: string;
}

interface SequencePhase extends ApplicationLifecyclePhaseDto {
  nodeType: Extract<SequenceNodeType, 'phase'>;
  successNextPhaseId?: string;
  failureNextPhaseId?: string;
  subPhases: SequenceSubPhase[];
}

interface PhaseLayoutNode {
  data: SequencePhase;
  x: number;
  y: number;
  width: number;
  height: number;
  subPhases: PhaseLayoutSubNode[];
}

interface PhaseLayoutSubNode {
  data: SequenceSubPhase;
  x: number;
  y: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-sequence-diagram-designer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sequence-diagram-designer.component.html',
  styleUrl: './sequence-diagram-designer.component.scss',
})
export class SequenceDiagramDesignerComponent {
  private nextId = 0;

  readonly startX = 60;
  readonly mainPhaseY = 160;
  readonly phaseWidth = 180;
  readonly phaseHeight = 70;
  readonly phaseGap = 220;
  readonly parallelGap = 90;
  readonly subPhaseHeight = 60;
  readonly endSpacing = 120;
  readonly endRadius = 28;

  readonly endNodes = [
    { id: 1, label: 'End 1' },
    { id: 2, label: 'End 2' },
    { id: 3, label: 'End 3' },
  ];

  readonly phases = signal<SequencePhase[]>([
    this.createPhase('Phase 1'),
  ]);

  readonly selectedNode = signal<SelectedNode | null>(null);

  readonly phaseLayout = computed<PhaseLayoutNode[]>(() => {
    return this.phases().map((phase, index) => {
      const x = this.startX + index * this.phaseGap;
      const y = this.mainPhaseY;
      const subPhases = phase.subPhases.map((subPhase, subIndex) => ({
        data: subPhase,
        x,
        y: this.mainPhaseY + this.phaseHeight + (subIndex + 1) * this.parallelGap,
        width: this.phaseWidth,
        height: this.subPhaseHeight,
      }));

      return {
        data: phase,
        x,
        y,
        width: this.phaseWidth,
        height: this.phaseHeight,
        subPhases,
      };
    });
  });

  readonly diagramWidth = computed(() => {
    return this.startX + this.phaseGap * this.phases().length + this.phaseWidth + 260;
  });

  readonly diagramHeight = computed(() => {
    const baseHeight = this.mainPhaseY + this.phaseHeight + this.parallelGap;
    const maxSubPhases = this.phases().reduce((max, phase) => Math.max(max, phase.subPhases.length), 0);
    const subPhaseHeight = baseHeight + maxSubPhases * this.parallelGap;
    const endSectionHeight = this.mainPhaseY - 60 + (this.endNodes.length - 1) * this.endSpacing + this.endRadius * 2 + 80;
    return Math.max(subPhaseHeight + 160, endSectionHeight);
  });

  readonly endPositions = computed(() => {
    const x = this.diagramWidth() - 100;
    const startY = this.mainPhaseY - 80;

    return this.endNodes.map((end, index) => ({
      ...end,
      x,
      y: startY + index * this.endSpacing,
    }));
  });

  readonly exportedStructure = computed<ApplicationLifecyclePhaseDto[]>(() =>
    this.phases().map(phase => this.mapPhaseToDto(phase))
  );

  readonly exportedJson = computed(() => JSON.stringify(this.exportedStructure(), null, 2));

  addPhase(): void {
    this.phases.update(phases => [...phases, this.createPhase(`Phase ${phases.length + 1}`)]);
  }

  addParallelPhase(): void {
    const selected = this.selectedNode();
    if (!selected || selected.type !== 'phase') {
      return;
    }

    const parallelIndex =
      this.phases().find(p => p.id === selected.phaseId)?.subPhases.length ?? 0;

    this.phases.update(phases =>
      phases.map(phase =>
        phase.id === selected.phaseId
          ? {
              ...phase,
              subPhases: [...phase.subPhases, this.createSubPhase(`Parallel ${parallelIndex + 1}`)],
            }
          : phase
      )
    );
  }

  deleteSelected(): void {
    const selected = this.selectedNode();
    if (!selected) {
      return;
    }

    if (selected.type === 'phase') {
      const updated = this.phases().filter(phase => phase.id !== selected.phaseId);
      if (updated.length === 0) {
        this.phases.set([this.createPhase('Phase 1')]);
      } else {
        this.phases.set(updated);
      }
    } else {
      this.phases.update(phases =>
        phases.map(phase =>
          phase.id === selected.phaseId
            ? { ...phase, subPhases: phase.subPhases.filter(sub => sub.id !== selected.subPhaseId) }
            : phase
        )
      );
    }

    this.selectedNode.set(null);
  }

  selectPhase(phaseId: string): void {
    this.selectedNode.set({ type: 'phase', phaseId });
  }

  selectSubPhase(phaseId: string, subPhaseId: string): void {
    this.selectedNode.set({ type: 'subPhase', phaseId, subPhaseId });
  }

  isPhaseSelected(phaseId: string): boolean {
    const selected = this.selectedNode();
    return selected?.type === 'phase' && selected.phaseId === phaseId;
  }

  isSubPhaseSelected(phaseId: string, subPhaseId: string): boolean {
    const selected = this.selectedNode();
    return selected?.type === 'subPhase' && selected.phaseId === phaseId && selected.subPhaseId === subPhaseId;
  }

  updateSelectedName(name: string): void {
    const selected = this.selectedNode();
    if (!selected) {
      return;
    }

    this.phases.update(phases =>
      phases.map(phase => {
        if (selected.type === 'phase' && phase.id === selected.phaseId) {
          return { ...phase, name };
        }

        if (selected.type === 'subPhase' && phase.id === selected.phaseId) {
          return {
            ...phase,
            subPhases: phase.subPhases.map(sub =>
              sub.id === selected.subPhaseId ? { ...sub, name } : sub
            ),
          };
        }

        return phase;
      })
    );
  }

  updateSelectedEnd(targetEnd: number): void {
    const selected = this.selectedNode();
    if (!selected) {
      return;
    }

    this.phases.update(phases =>
      phases.map(phase => {
        if (selected.type === 'phase' && phase.id === selected.phaseId) {
          return { ...phase, successPhaseId: targetEnd };
        }

        if (selected.type === 'subPhase' && phase.id === selected.phaseId) {
          return {
            ...phase,
            subPhases: phase.subPhases.map(sub =>
              sub.id === selected.subPhaseId ? { ...sub, successPhaseId: targetEnd } : sub
            ),
          };
        }

        return phase;
      })
    );
  }

  updateSelectedSuccessPhase(successPhaseId: string | undefined): void {
    const selected = this.selectedNode();
    if (!selected) {
      return;
    }

    this.phases.update(phases =>
      phases.map(phase => {
        if (selected.type === 'phase' && phase.id === selected.phaseId) {
          return { ...phase, successNextPhaseId: successPhaseId };
        }

        if (selected.type === 'subPhase' && phase.id === selected.phaseId) {
          return {
            ...phase,
            subPhases: phase.subPhases.map(sub =>
              sub.id === selected.subPhaseId ? { ...sub, successNextPhaseId: successPhaseId } : sub
            ),
          };
        }

        return phase;
      })
    );
  }

  updateSelectedFailurePhase(failurePhaseId: string | undefined): void {
    const selected = this.selectedNode();
    if (!selected) {
      return;
    }

    this.phases.update(phases =>
      phases.map(phase => {
        if (selected.type === 'phase' && phase.id === selected.phaseId) {
          return { ...phase, failureNextPhaseId: failurePhaseId };
        }

        if (selected.type === 'subPhase' && phase.id === selected.phaseId) {
          return {
            ...phase,
            subPhases: phase.subPhases.map(sub =>
              sub.id === selected.subPhaseId ? { ...sub, failureNextPhaseId: failurePhaseId } : sub
            ),
          };
        }

        return phase;
      })
    );
  }

  get selectedName(): string {
    const selected = this.selectedNode();
    if (!selected) {
      return '';
    }

    if (selected.type === 'phase') {
      return this.phases().find(phase => phase.id === selected.phaseId)?.name ?? '';
    }

    const parent = this.phases().find(phase => phase.id === selected.phaseId);
    return parent?.subPhases.find(sub => sub.id === selected.subPhaseId)?.name ?? '';
  }

  get selectedSuccessPhaseId(): string | undefined {
    const selected = this.selectedNode();
    if (!selected) {
      return undefined;
    }

    if (selected.type === 'phase') {
      return this.phases().find(phase => phase.id === selected.phaseId)?.successNextPhaseId;
    }

    const parent = this.phases().find(phase => phase.id === selected.phaseId);
    return parent?.subPhases.find(sub => sub.id === selected.subPhaseId)?.successNextPhaseId;
  }

  get selectedFailurePhaseId(): string | undefined {
    const selected = this.selectedNode();
    if (!selected) {
      return undefined;
    }

    if (selected.type === 'phase') {
      return this.phases().find(phase => phase.id === selected.phaseId)?.failureNextPhaseId;
    }

    const parent = this.phases().find(phase => phase.id === selected.phaseId);
    return parent?.subPhases.find(sub => sub.id === selected.subPhaseId)?.failureNextPhaseId;
  }

  get selectedTargetEnd(): number {
    const selected = this.selectedNode();
    if (!selected) {
      return this.endNodes[0].id;
    }

    if (selected.type === 'phase') {
      return this.phases().find(phase => phase.id === selected.phaseId)?.successPhaseId as number ?? this.endNodes[0].id;
    }

    const parent = this.phases().find(phase => phase.id === selected.phaseId);
    return (
      parent?.subPhases.find(sub => sub.id === selected.subPhaseId)?.successPhaseId as number ?? this.endNodes[0].id
    );
  }

  getAvailablePhases(excludePhaseId?: string): SequencePhase[] {
    return this.phases().filter(p => p.id !== excludePhaseId);
  }

  get selectedTypeLabel(): string {
    const selected = this.selectedNode();
    if (!selected) {
      return '';
    }

    return selected.type === 'phase' ? 'Phase' : 'Parallel Phase';
  }

  getEndPosition(endId: number): { x: number; y: number } | undefined {
    return this.endPositions().find(end => end.id === endId);
  }

  getPhasePosition(phaseId: string | undefined): { x: number; y: number } | undefined {
    if (!phaseId) return undefined;
    const layout = this.phaseLayout().find(p => p.data.id === phaseId);
    if (!layout) return undefined;
    return { x: layout.x, y: layout.y + layout.height / 2 };
  }

  getEndPositionFromPhaseOrSubPhase(successPhaseId: string | number | undefined): { x: number; y: number } | undefined {
    if (typeof successPhaseId === 'number') {
      return this.getEndPosition(successPhaseId);
    }
    return undefined;
  }

  downloadJson(): void {
    const data = this.exportedJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'application-lifecycle.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  trackPhase(_: number, phase: PhaseLayoutNode): string {
    return phase.data.id;
  }

  trackSubPhase(_: number, sub: PhaseLayoutSubNode): string {
    return sub.data.id;
  }

  private createPhase(name: string): SequencePhase {
    return {
      id: this.generateId(),
      name,
      nodeType: 'phase',
      value: undefined,
      lifecycleState: 'InProgress',
      isEnd: false,
      failurePhaseId: undefined,
      successPhaseId: undefined,
      failureButtonText: undefined,
      successButtonText: undefined,
      successNextPhaseId: undefined,
      failureNextPhaseId: undefined,
      subPhases: [],
    };
  }

  private createSubPhase(name: string): SequenceSubPhase {
    return {
      id: this.generateId(),
      name,
      nodeType: 'parallel',
      value: undefined,
      lifecycleState: 'InProgress',
      isEnd: false,
      failurePhaseId: undefined,
      successPhaseId: undefined,
      failureButtonText: undefined,
      successButtonText: undefined,
      successNextPhaseId: undefined,
      failureNextPhaseId: undefined,
    };
  }

  private mapPhaseToDto(phase: SequencePhase): ApplicationLifecyclePhaseDto {
    return {
      id: phase.id,
      name: phase.name,
      value: phase.value,
      lifecycleState: phase.lifecycleState as ApplicationLifecycleState,
      isEnd: phase.isEnd,
      failurePhaseId: phase.failureNextPhaseId || phase.failurePhaseId,
      successPhaseId: phase.successNextPhaseId || phase.successPhaseId,
      failureButtonText: phase.failureButtonText,
      successButtonText: phase.successButtonText,
      subPhases: phase.subPhases.map<ApplicationLifecycleSubPhaseDto>(sub => ({
        id: sub.id,
        name: sub.name,
        value: sub.value,
        lifecycleState: sub.lifecycleState,
        isEnd: sub.isEnd,
        failurePhaseId: sub.failureNextPhaseId || sub.failurePhaseId,
        successPhaseId: sub.successNextPhaseId || sub.successPhaseId,
        failureButtonText: sub.failureButtonText,
        successButtonText: sub.successButtonText,
      })),
    };
  }

  private generateId(): string {
    this.nextId += 1;
    return `phase-${this.nextId}`;
  }
}
