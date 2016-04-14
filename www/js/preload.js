var PreloadState = {
    preload: function() {

        this.game.stage.backgroundColor = "#FFF";
        this.scoreText = this.game.add.text(16, 16, 'Loading...', { fontSize: '32px', fill: '#000' });

        this.preloadBar = this.add.sprite(game.world.centerX - 334, game.world.centerY - 50, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadBar);

        this.game.load.tilemap('tilemapLevel1', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.tilemap('tilemapLevel2', 'assets/maps/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('Background', 'assets/mapTail/BackgroundGradient.png');
        this.game.load.image('Platforms', 'assets/mapTail/Platforms.png');
        this.game.load.image('star', 'assets/img/star.png');
        this.game.load.image('enemy', 'assets/img/enemy.png');
        this.game.load.image('live', 'assets/img/firstaid.png');
        this.game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
        this.game.load.audio('coinSound', 'assets/Sounds/takecoin.wav');
        this.game.load.audio('jumpSound', 'assets/Sounds/jump.wav');
        this.game.load.audio('deadSound', 'assets/Sounds/dead.wav');
        this.game.load.audio('musicSound', 'assets/Sounds/music.mp3');
        this.game.load.audio('rainSound', 'assets/Sounds/rain.mp3');
        this.game.load.spritesheet('rain', 'assets/img/rain.png', 30, 30);
        this.game.load.image('bullet', 'assets/img/bullet.png');
        this.game.load.spritesheet('kaboom', 'assets/img/explode.png', 128, 128);
        this.game.load.audio('shootSound', 'assets/Sounds/shoot.wav');
        this.game.load.image('right', 'assets/img/right.png');
        this.game.load.image('left', 'assets/img/left.png');
        this.game.load.image('jump', 'assets/img/jump.png');
        this.game.load.image('shoot', 'assets/img/shoot.png');

    },
    create : function() {

        this.game.state.start('Level1');

    }
};
