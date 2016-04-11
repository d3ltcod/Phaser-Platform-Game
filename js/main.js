var game = new Phaser.Game(1024, 768, Phaser.AUTO, '');

this.game.state.add('Menu', Menu);
this.game.state.add('Game', Game);
this.game.state.add('Game_Over', Game_Over);
this.game.state.add('PreloadState', PreloadState);
this.game.state.start('Menu');