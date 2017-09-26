import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { Spinner } from '../directives/spinner.directive';
import { InviteHandler } from '../directives/invite-handler.directive';

import { ServerCommunicator } from '../services/server-communicator.service';
import { CustomEventService } from '../services/event-pub-sub.service';
import { GenericConfig } from '../services/generic-config.service';
import { Utils } from '../services/utils.service';
import { _settings } from '../settings';
import { FilterPlayersPipe } from '../filters/search-players-pipe.filter';

@Component({
	selector: 'PlayersList',
	styleUrls: ['../../../app/css/player-list.css'],
	templateUrl: '../../../app/templates/components/player-list.template.html'
})

export class PlayersList {
	private playersList: Array<any>;
	showLoader: Boolean;
	@ViewChild(InviteHandler) inviteHandler: InviteHandler;

	constructor(
		private router: Router,
		private customEventService: CustomEventService,
		private serverCommunicator: ServerCommunicator,
		private genericConfig: GenericConfig,
		private utils: Utils
	) {

		customEventService.onHeaderClicked.subscribe((data: any) => this.onHeaderClicked(data));
		customEventService.onPlayersListReceived.subscribe((data: any) => this.onPlayersListReceived(data));
		customEventService.onStartGame.subscribe((data: any) => this.onStartGame());
		customEventService.onSendingInvite.subscribe((data: any) => this.onSendingInvite());
		customEventService.onEndGame.subscribe((data: any) => this.endGame());

		this.showLoader = false;
		this.serverCommunicator.msgSender('get-players-list', {});
	}

	ngAfterViewInit() {
		this.utils.log(this.inviteHandler);
	}

	onStartGame() {
		this.router.navigate(['gameplay']);
	}

	onRecipientSelected(event: Event, emailId: string) {
		this.inviteHandler.onRecipientSelected(event, emailId);
	}

	onSendingInvite() {
		this.showLoader = true;
	}

	onPlayersListReceived(data?: any) {
		let list: Array<any> = [],
			tempList: Array<any> = [];

		this.utils.log('on playersList: ', data);
		if (data) {
			list = data;
		} else {
			list = this.serverCommunicator.playersList;
		}
		for (let i = 0, len = list.length; i < len; i++) {
			if (list[i].emailId !== this.genericConfig.multiPlayerConfig.emailId) {
				tempList.push(list[i]);
			}
		}
		this.playersList = tempList;
	}

	/*
	* Functions to handler
	* Click on headers for current component
	*/
	onHeaderClicked(data: any) {
		if (data.routeName === '/playerslist') {
			switch (data.btnType) {
				case 'left':
					this.goToHome();
					break;

				case 'right':
					break;
			}
		}
	}

	goToHome() {
		this.router.navigate(['home']);
	}

	endGame() {
		this.showLoader = false;
	}
}
