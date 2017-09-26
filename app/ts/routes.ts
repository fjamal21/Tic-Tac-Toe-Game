import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './components/home.component';
import { PlayersList } from './components/players-list.component';
import { GamePlay } from './components/game-play.component';

export const routes: Routes = [
	{ path: 'home', component: Home },
	{ path: 'playerslist', component: PlayersList },
	{ path: 'gameplay', component: GamePlay },
	{ path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
