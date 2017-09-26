export interface GenericConfigInterface {
	gridSize: number;
	playGame: Boolean;
	ways: Array<Array<any>>;
	choices: Array<number>;
	corners: Array<number>;
	gridComputationLen: number;
	multiPlayer: Boolean;
}

export interface multiPlayerConfigInterface {
	emailId: string;
	username: string;
	recipient: string;
	player1: Boolean;
	playerTurn: Boolean;
	playerSymbol: string;
}

export interface computerConfigInterface {
	gameLevel: number;
	playerstarts: Boolean;
}

export interface gameScoreInterface {
	totalGames: number;
	draws: number;
	playerWins: number;
	computerWins: number;
}

export interface CurrentGameConfigInterface {
	isWon: Boolean;
	moves: Array<any>;
	stepsPlayed: number;
	movesIndex: Array<any>;
}

export interface homeModelInterface {
	gameLevel: number;
	opponent: number;
	firstChance: number;
	userEmail: string;
	username: string;
}

export interface initSetupInterface {
	value: number;
	text: string;
	cssClass: string;
}

export interface headerInterface {
	text: string;
	btnType: string;
	showBtn: Boolean;
}

export interface ModalDialogueInterface {
	isVisible: Boolean;
	title: string;
	body: string;
	btn1Txt?: string,
	btn2Txt?: string,
	showBtn2: Boolean;
	btn1Callback?: Function;
	btn2Callback?: Function;
	closeBtnCallback?: Function;
}

export interface ScorecardModelInterface {
	opponent: string;
	symbol: string;
	chance: string;
}
