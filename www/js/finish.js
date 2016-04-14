var Finish = {

    preload : function() {
        this.stateText = game.add.text(game.camera.width / 2,100,' ', { font: '24px Arial', fill: '#fff' });
        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.text = " Congratulations!\n Game completed, \n --Click to go Menu--";
    },

    create : function() {
        this.game.stage.backgroundColor = "#000000"
        this.stateText.visible = true;
        game.input.onTap.addOnce( this.startMenu,this);

    },

    startMenu: function () {

        // Change the state back to Game.
        this.state.start('Menu');
    }

};
