import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { McattachmentdailogComponent } from './mcattachmentdailog.component';

describe('McattachmentdailogComponent', () => {
  let component: McattachmentdailogComponent;
  let fixture: ComponentFixture<McattachmentdailogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ McattachmentdailogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McattachmentdailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
