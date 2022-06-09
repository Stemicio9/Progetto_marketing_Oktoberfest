import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabellautentiComponent } from './tabellautenti.component';

describe('TabellautentiComponent', () => {
  let component: TabellautentiComponent;
  let fixture: ComponentFixture<TabellautentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabellautentiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabellautentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
