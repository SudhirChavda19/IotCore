import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MydeviceComponent } from './mydevice.component';

describe('MydeviceComponent', () => {
  let component: MydeviceComponent;
  let fixture: ComponentFixture<MydeviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MydeviceComponent]
    });
    fixture = TestBed.createComponent(MydeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
