import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../service/game.service';

export const gameGuard: CanActivateFn = (_, __) => {
  const gameService = inject(GameService);
  if (!gameService.hasGame) {
    if(gameService.canContinue) {
      gameService.continueGame();
      return true;
    }
    return inject(Router).createUrlTree(['menu']);
  }
  return true;
};
