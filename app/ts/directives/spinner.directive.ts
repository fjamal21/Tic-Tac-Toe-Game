import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GenericConfig } from '../services/generic-config.service';
import { _settings } from '../settings';

@Component({
	selector: 'spinner',
	inputs: ['showLoader'],
	styleUrls: ['../../../app/css/spinner.css'],
	templateUrl: '../../../app/templates/directives/spinner.template.html'
})

export class Spinner {
	constructor() { }
}
