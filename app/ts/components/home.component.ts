import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Spinner } from '../directives/spinner.directive';
import { ModalDialouge } from '../directives/modal-dialogue.directive';

import { Utils } from '../services/utils.service';
import { ModalDialogueInterface } from '../services/app-interfaces.service';
import { ServerCommunicator } from '../services/server-communicator.service';
import { CustomEventService } from '../services/event-pub-sub.service';
import { GenericConfig } from '../services/generic-config.service';
import { homeModelInterface, initSetupInterface } from '../services/app-interfaces.service';
import { _settings } from '../settings';

@Component({
	selector: 'Home',
	styleUrls: ['../../../app/css/home.css'],
	templateUrl: '../../../app/templates/components/home.template.html'
})

export class Home {
	model: homeModelInterface;
	gameLevels: initSetupInterface[] = [];
	opponentOptions: initSetupInterface[] = [];
	gameStarter: initSetupInterface[] = [];
	modalDialogue: ModalDialogueInterface;

	alreadyRegistered: Boolean = false;
	showLoader: Boolean = false;

	constructor(
		private genericConfig: GenericConfig,
		private router: Router,
		private customEventService: CustomEventService,
		private serverCommunicator: ServerCommunicator,
		private utils: Utils
	) {
		if (this.genericConfig.multiPlayerConfig.emailId !== '') {
			this.alreadyRegistered = true;
		}
		this.showLoader = false;
		this.modalDialogueDefault();

		this.model = {
			gameLevel: 2,
			opponent: 2,
			firstChance: 1,
			userEmail: this.genericConfig.multiPlayerConfig.emailId,
			username: this.genericConfig.multiPlayerConfig.username
		};

		this.defaultOptions();
		customEventService.onHeaderClicked.subscribe((data: any) => this.onHeaderClicked(data));
		customEventService.onRegisterEmail.subscribe((data: any) => this.onRegisterEmail(data));
	}

	onHeaderClicked(data: any) {
		this.utils.log('onHeaderClicked: ', data);
		if (data.routeName === '/home') {
			switch (data.btnType) {
				case 'left':
					break;

				case 'right':
					this.startGame();
					break;
			}
		}
	}

	startGame(event?: Event) {
		this.utils.log('startGame');
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (this.model.opponent === 2) {
			this.registerPlayer();
		} else {
			this.genericConfig.config.multiPlayer = false;
			this.genericConfig.computerConfig.playerstarts = (this.model.firstChance === 1) ? true : false;
			this.genericConfig.computerConfig.gameLevel = this.model.gameLevel;
			this.router.navigate(['gameplay']);
		}
	}

	registerPlayer(event?: Event) {
		if (this.model.userEmail && this.model.username) {
			this.showLoader = true;
			this.genericConfig.config.multiPlayer = true;

			this.genericConfig.multiPlayerConfig.emailId = this.model.userEmail;
			this.genericConfig.multiPlayerConfig.username = this.model.username;
			this.genericConfig.multiPlayerConfig.player1 = false;
			this.genericConfig.multiPlayerConfig.playerSymbol = 'o';
			this.genericConfig.multiPlayerConfig.playerTurn = false;

			if (!this.alreadyRegistered) {
				this.serverCommunicator.msgSender('register-email', {
					emailId: this.model.userEmail,
					username: this.model.username
				});
			}
		}
	}

	onRegisterEmail(response: any) {
		this.utils.log('onRegisterEmail: ', response);
		if (response) {
			this.router.navigate(['playerslist']);
		} else {
			this.utils.log('email already in use');
			this.modalDialogue = {
				isVisible: true,
				title: 'Error',
				body: 'Email address is already in use',
				btn1Txt: 'ok',
				btn2Txt: '',
				showBtn2: false,
				btn1Callback: this.hideModal.bind(this),
			};
		}
	}

	hideModal() {
		this.showLoader = false;
		this.modalDialogueDefault();
	}

	modalDialogueDefault() {
		this.modalDialogue = {
			isVisible: false,
			title: '',
			body: '',
			btn1Txt: '',
			btn2Txt: '',
			showBtn2: false,
			btn1Callback: function() { },
			btn2Callback: function() { },
			closeBtnCallback: function() { }
		};
	}

	defaultOptions() {
		this.gameLevels = [{
			'value': 1,
			'text': 'Easy',
			'cssClass': 'btn-success'
		},
			{
				'value': 2,
				'text': 'Medium',
				'cssClass': 'btn-warning'
			},
			{
				'value': 3,
				'text': 'Expert',
				'cssClass': 'btn-danger'
			}];

		this.opponentOptions = [{
			'value': 1,
			'text': 'vs Computer',
			'cssClass': 'btn-info'
		},
			{
				'value': 2,
				'text': 'Multi Player',
				'cssClass': 'btn-primary'
			}];

		this.gameStarter = [{
			'value': 1,
			'text': 'You',
			'cssClass': 'btn-info'
		},
			{
				'value': 2,
				'text': 'Computer',
				'cssClass': 'btn-primary'
			}];
	}
}
