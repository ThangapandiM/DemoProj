import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTabsComponent } from './master-tabs.component';

describe('MasterTabsComponent', () => {
  let component: MasterTabsComponent;
  let fixture: ComponentFixture<MasterTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
