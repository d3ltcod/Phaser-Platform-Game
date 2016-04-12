var Finish = {

    preload : function() {
        // Load the needed image for this game screen.
        this.game.load.image('finish', 'assets/img/finish.png');
    },

    create : function() {

        // Create button to start game like in Menu.
        this.add.button(0, 0, 'finish', this.startMenu, this);

    },

    startMenu: function () {

        // Change the state back to Game.
        this.state.start('Menu');
    }

};
