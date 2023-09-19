import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicecardComponent } from './devicecard.component';

describe('DevicecardComponent', () => {
  let component: DevicecardComponent;
  let fixture: ComponentFixture<DevicecardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DevicecardComponent]
    });
    fixture = TestBed.createComponent(DevicecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
