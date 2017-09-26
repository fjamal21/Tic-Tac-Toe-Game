import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppRoutingModule } from './routes';
import { CustomEventService } from './services/event-pub-sub.service';
import { ServerCommunicator } from './services/server-communicator.service';
import { GenericConfig } from './services/generic-config.service';
import { Utils } from './services/utils.service';
import { FilterPlayersPipe } from './filters/search-players-pipe.filter'

import { App } from './components/app.component';
import { Home } from './components/home.component';
import { PlayersList } from './components/players-list.component';
import { GamePlay } from './components/game-play.component';
import { AppHeader } from './components/header.component';

import { GameGrid } from './directives/game-grid.directive';
import { ScoreCard } from './directives/score-card.directive';
import { ModalDialouge } from './directives/modal-dialogue.directive';
import { Spinner } from './directives/spinner.directive';
import { InviteHandler } from './directives/invite-handler.directive';

@NgModule({
  imports: [ BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, HttpModule, JsonpModule ],
  declarations: [ App, Home, PlayersList, GamePlay, AppHeader, GameGrid, ScoreCard, ModalDialouge, Spinner, InviteHandler, FilterPlayersPipe ],
  providers: [ CustomEventService, ServerCommunicator, GenericConfig, Utils, {provide: LocationStrategy, useClass: HashLocationStrategy} ],
  bootstrap: [ App ]
})

export class AppModule { }
