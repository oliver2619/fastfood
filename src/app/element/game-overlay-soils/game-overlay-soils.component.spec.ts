import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverlaySoilsComponent } from './game-overlay-soils.component';

describe('GameOverlaySoilsComponent', () => {
  let component: GameOverlaySoilsComponent;
  let fixture: ComponentFixture<GameOverlaySoilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverlaySoilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameOverlaySoilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
