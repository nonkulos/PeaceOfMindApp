import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentalHealthPage } from './mental-health.page';

describe('MentalHealthPage', () => {
  let component: MentalHealthPage;
  let fixture: ComponentFixture<MentalHealthPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MentalHealthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
