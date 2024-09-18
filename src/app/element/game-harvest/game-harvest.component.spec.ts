import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameHarvestComponent } from './game-harvest.component';

describe('GameHarvestComponent', () => {
  let component: GameHarvestComponent;
  let fixture: ComponentFixture<GameHarvestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameHarvestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameHarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
