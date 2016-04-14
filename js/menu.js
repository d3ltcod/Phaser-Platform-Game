var Menu = {

    preload : function() {
        this.game.load.image('preloadBar', 'assets/img/loading.png');
        this.stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '24px Arial', fill: '#fff' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.text = " Phaser Platform Game, \n       --Click to start--";
    },

    create: function() {
        this.stateText.visible = true;
        game.input.onTap.addOnce( this.startGame,this);
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('PreloadState');

    }

};
