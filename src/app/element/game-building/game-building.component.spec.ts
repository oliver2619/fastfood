import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBuildingComponent } from './game-building.component';

describe('GameBuildingComponent', () => {
  let component: GameBuildingComponent;
  let fixture: ComponentFixture<GameBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBuildingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
