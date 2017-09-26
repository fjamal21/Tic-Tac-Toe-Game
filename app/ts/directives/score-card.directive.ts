import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GenericConfig } from '../services/generic-config.service';
import { ScorecardModelInterface } from '../services/app-interfaces.service';
import { _settings } from '../settings';

@Component({
	selector: 'score-card',
	inputs: ['isVisible', 'title', 'body', 'showBtn2'],
	styleUrls: ['../../../app/css/modal.css'],
	templateUrl: '../../../app/templates/directives/score-card.template.html'
})

export class ScoreCard {
	@Output() btn1Callback: EventEmitter<any> = new EventEmitter();
	@Output() btn2Callback: EventEmitter<any> = new EventEmitter();
	@Output() closeBtnCallback: EventEmitter<any> = new EventEmitter();

	private model: ScorecardModelInterface;
	constructor(private genericConfig: GenericConfig) {
		let opponent = (this.genericConfig.config.multiPlayer) ? this.genericConfig.multiPlayerConfig.recipient : 'Computer';
		let symbol = (this.genericConfig.config.multiPlayer) ? this.genericConfig.multiPlayerConfig.playerSymbol : 'x';
		let chance = (this.genericConfig.config.multiPlayer && !this.genericConfig.multiPlayerConfig.player1) ? 'Second' : 'First';

		this.model = {
			'opponent': opponent,
			'symbol': symbol,
			'chance': chance
		}
	}

	mainMenu(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		this.btn1Callback.emit(event);
	}

	playAgain(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		this.btn2Callback.emit(event);
	}

	hideModal(event?: Event) {
		event.preventDefault();
		event.stopPropagation();

		this.closeBtnCallback.emit(event);
	}
}
