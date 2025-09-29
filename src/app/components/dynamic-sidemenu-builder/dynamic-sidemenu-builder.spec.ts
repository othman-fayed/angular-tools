import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicSidemenuBuilder } from './dynamic-sidemenu-builder';
import { PageOption } from '../../models/page-option.interface';

describe('DynamicSidemenuBuilder', () => {
  let fixture: ComponentFixture<DynamicSidemenuBuilder>;
  let component: DynamicSidemenuBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicSidemenuBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicSidemenuBuilder);
    component = fixture.componentInstance;
  });

  it('should preserve collapsed state after toggle events', () => {
    const pageOptions: PageOption[] = [
      { id: 'dashboard', label: 'Dashboard', order: 0 },
      { id: 'reports', label: 'Reports', order: 1 }
    ];

    component.pageOptions = pageOptions;

    let latestConfigCollapsed: boolean | undefined;
    component.configChanged.subscribe(config => {
      latestConfigCollapsed = config.collapsed;
    });

    fixture.detectChanges();

    expect(component.sideMenuConfig.collapsed).withContext('initial state').toBeFalse();

    component.onMenuToggled(true);

    expect(component.sideMenuConfig.collapsed)
      .withContext('collapsed state should be preserved after toggle')
      .toBeTrue();
    expect(latestConfigCollapsed)
      .withContext('configChanged should emit updated collapsed state')
      .toBeTrue();

    component.onMenuToggled(false);

    expect(component.sideMenuConfig.collapsed)
      .withContext('collapsed state should update when menu is expanded again')
      .toBeFalse();
    expect(latestConfigCollapsed)
      .withContext('configChanged should emit collapsed=false when menu expands')
      .toBeFalse();
  });
});
