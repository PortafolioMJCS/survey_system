import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorForm } from './collaborator-form';

describe('CollaboratorForm', () => {
  let component: CollaboratorForm;
  let fixture: ComponentFixture<CollaboratorForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollaboratorForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CollaboratorForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
