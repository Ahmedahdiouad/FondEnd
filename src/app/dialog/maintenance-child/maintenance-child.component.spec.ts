import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceChildComponent } from './maintenance-child.component';

describe('MaintenanceChildComponent', () => {
  let component: MaintenanceChildComponent;
  let fixture: ComponentFixture<MaintenanceChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintenanceChildComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
