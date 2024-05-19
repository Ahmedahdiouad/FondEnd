import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingChildComponent } from './shipping-child.component';

describe('ShippingChildComponent', () => {
  let component: ShippingChildComponent;
  let fixture: ComponentFixture<ShippingChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShippingChildComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShippingChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
