import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorDashboard } from './collaborator-dashboard';

describe('CollaboratorDashboard', () => {
  let component: CollaboratorDashboard;
  let fixture: ComponentFixture<CollaboratorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaboratorDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(CollaboratorDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
