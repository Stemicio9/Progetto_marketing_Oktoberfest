import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreaspaziopubblicitarioComponent } from './creaspaziopubblicitario.component';

describe('CreaspaziopubblicitarioComponent', () => {
  let component: CreaspaziopubblicitarioComponent;
  let fixture: ComponentFixture<CreaspaziopubblicitarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreaspaziopubblicitarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaspaziopubblicitarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
