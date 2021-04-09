import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderDashboardComponent } from './calender-dashboard.component';

describe('CalenderDashboardComponent', () => {
  let component: CalenderDashboardComponent;
  let fixture: ComponentFixture<CalenderDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenderDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
