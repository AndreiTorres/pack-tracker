import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPacksComponent } from './list-packs.component';

describe('ListPacksComponent', () => {
  let component: ListPacksComponent;
  let fixture: ComponentFixture<ListPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
