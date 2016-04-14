var Game_Over = {

    preload : function() {
        this.stateText = game.add.text(game.camera.width / 2,100,' ', { font: '24px Arial', fill: '#FFFFFF' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.text = " Game Over, \n --Click to restart--";
    },

    create : function() {
        this.game.stage.backgroundColor = "#000000"
        this.stateText.visible = true;
        game.input.onTap.addOnce( this.startGame,this);

    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Level1');

    }

};
