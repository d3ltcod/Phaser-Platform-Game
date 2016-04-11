var Game_Over = {

    preload : function() {
        // Load the needed image for this game screen.
        this.game.load.image('gameover', 'assets/img/gameover.jpg');
    },

    create : function() {

        // Create button to start game like in Menu.
        this.add.button(0, 0, 'gameover', this.startGame, this);

    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Game');


    }

};
