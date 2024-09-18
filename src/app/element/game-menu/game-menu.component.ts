import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GameService } from '../../service/game.service';
import { TranslateDirective } from '../translate.directive';
import { FrameComponent } from "../frame/frame.component";
import { FrameButtonDirective } from '../frame-button.directive';

@Component({
    selector: 'ff-game-menu',
    standalone: true,
    templateUrl: './game-menu.component.html',
    styleUrl: './game-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, TranslateDirective, FrameComponent, FrameButtonDirective]
})
export class GameMenuComponent {

  constructor(private readonly router: Router, private readonly gameService: GameService) {}

  continue() {
    this.router.navigateByUrl('/game');
  }

  exit() {
    this.gameService.exit();
    this.router.navigateByUrl('/menu');
  }

  score() {
    this.router.navigateByUrl('/game/score');
  }

  settings() {
    this.router.navigateByUrl('/game/settings');
  }

  statistics() {
    this.router.navigateByUrl('/game/statistics');
  }
}
