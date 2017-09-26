import { Injectable, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

import { Utils } from '../services/utils.service';

@Injectable()
export class CustomEventService {
	@Output() onRouteChange: EventEmitter<any> = new EventEmitter();
	@Output() onHeaderClicked: EventEmitter<any> = new EventEmitter();
	public onRegisterEmail: EventEmitter<Object> = new EventEmitter();
	public onPlayersListReceived: EventEmitter<Object> = new EventEmitter();
	public onSendingInvite: EventEmitter<Object> = new EventEmitter();
	public onInviteRequest: EventEmitter<Object> = new EventEmitter();
	public onInviteAction: EventEmitter<Object> = new EventEmitter();
	public onMoveReceived: EventEmitter<Object> = new EventEmitter();
	public onReMatchRequest: EventEmitter<Object> = new EventEmitter(); 
	public onStartGame: EventEmitter<Object> = new EventEmitter();
	public onEndGame: EventEmitter<Object> = new EventEmitter();
	public onGameQuit: EventEmitter<Object> = new EventEmitter();

	constructor(
		private router: Router,
		private location: Location,
		private utils: Utils
	) {
		router.events.subscribe((event) => {
			if(event.constructor.name === 'NavigationEnd') {
				this.onRouteChange.emit(event.url);
			}
		});
	}

	headerBtnClicked(btnType: string) {
		this.utils.log('headerBtnClicked, btnType: ' + btnType);
		this.onHeaderClicked.emit({
			btnType: btnType,
			routeName: this.location.path()
		});
	}

	registerEmail(data: any) {
		this.onRegisterEmail.emit(data);
	}

	playersListReceived(data: any) {
		this.onPlayersListReceived.emit(data);
	}

	sendingInvite() {
		this.onSendingInvite.emit(null);
	}

	inviteRequest(data: any) {
		this.onInviteRequest.emit(data);
	}

	inviteAction(data: any) {
		this.onInviteAction.emit(data);
	}

	moveReceived(data: any) {
		this.onMoveReceived.emit(data);
	}

	reMatchRequest() {
		this.onReMatchRequest.emit(null);
	}

	startGame() {
		this.onStartGame.emit(null);
	}

	endGame() {
		this.onEndGame.emit(null);	
	}

	gameQuit() {
		this.onGameQuit.emit(null);
	}
}
