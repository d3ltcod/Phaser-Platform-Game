var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, 'gameArea');

this.game.state.add('Menu', Menu);
this.game.state.add('Level1', Level1);
this.game.state.add('Level2', Level2);
this.game.state.add('Game_Over', Game_Over);
this.game.state.add('PreloadState', PreloadState);
this.game.state.add('Finish', Finish);
this.game.state.start('Menu');