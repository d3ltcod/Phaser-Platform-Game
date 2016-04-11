var Menu = {

    preload : function() {
        this.game.load.image('menu', 'assets/img/menu.png');
        this.game.load.image('preloadBar', 'assets/img/loading.png');
    },

    create: function() {
        this.add.button(0, 0, 'menu', this.startGame, this);
    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('PreloadState');

    }

};
