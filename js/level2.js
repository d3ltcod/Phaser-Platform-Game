var Level2 = {

    create: function() {
        //Added map
        this.addMap();

        //Added physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Added sounds
        this.addSound();


        //Added player and enable pysics
        this.addPlayer();

        //Player lives
        this.addLives();


        //Added some coins
        this.addCoins();

        //Added enemy
        this.addEnemy();

        //Added Particles
        this.setParticles();

        //  The score
        this.score = 0;
        this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        this.game.physics.arcade.collide(this.player, this.platformsLayer);
        this.game.physics.arcade.collide(this.stars, this.platformsLayer);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.player, this.stars, this.takeCoin, null, this);
        //  Checks to see if the player overlaps with any of the enemy, if he does call the deadPlayer function
        this.game.physics.arcade.overlap(this.player, this.enemy, this.deadPlayer, null, this);

        this.inputs();

        if ( this.player.position.x > 3080){
            this.music.stop();
            this.game.state.start('Finish');
        }
    },

    inputs: function() {
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown)
        {
            if (this.player.body.onFloor())
            {
                this.player.body.velocity.y = -350;
                this.jumpSound.play();
            }
        }
    },

    addMap: function(){
        this.map = this.game.add.tilemap('tilemapLevel2');
        this.map.addTilesetImage('Background');
        this.map.addTilesetImage('Platforms');

        this.backgroundLayer = this.map.createLayer('Background');
        this.platformsLayer = this.map.createLayer('Platforms');

        //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 10000, true, 'Platforms');

        this.backgroundLayer.resizeWorld();
    },

    addCoins: function(){

        this.stars = this.game.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        for (var i = 0; i < 20; i++)
        {
            //  Create a star inside of the 'stars' group
            this.star = this.stars.create(i * 140, 250, 'star');

            //  Let gravity do its thing
            this.star.body.gravity.y = 700;

            //  This just gives each star a slightly random bounce value
            this.star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    },

    takeCoin: function (player, star) {
        // Removes the star from the screen with tween
        star.body.enable = false;
        game.add.tween(star.scale).to({x:0}, 150).start();
        game.add.tween(star).to({y:50}, 150).start();
        this.coinSound.play();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
        this.coinSound.play();

    },

    addSound: function(){
        this.coinSound = this.game.add.audio('coin', 0.3);
        this.jumpSound = this.game.add.audio('jump', 0.3);
        this.deadSound = this.game.add.audio('dead', 0.3);
        this.music = this.game.add.audio('music', 0.2);
        this.music.play().loopFull();;
    },

    addEnemy: function (){

        this.enemy = this.game.add.group();

        this.enemy.create(840, 550, 'enemy');
        this.enemy.create(2260, 550, 'enemy');

        this.game.physics.arcade.enable(this.enemy);

    },

    addPlayer: function(){
        this.player = this.game.add.sprite(1, this.game.world.height -195, 'dude');
        this.game.physics.arcade.enable(this.player);
        //Make the camera follow the sprite
        this.game.camera.follow(this.player);

        // Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 420;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    },

    deadPlayer: function (){

        this.exp.x = this.player.x;
        this.exp.y = this.player.y+10;
        this.exp.start(true, 500, null, 20);

        this.shakeEffect(this.enemy);

        this.deadSound.play();
        this.lives--;
        this.remainingLives.removeChildAt(this.lives);

        if (this.lives == 0){
            this.playerDead = true;
        }

        if (this.playerDead) {
            this.music.stop();
            this.game.state.start('Game_Over');

        } else {
            this.reset();
        }


    },

    reset: function(){
        this.player.scale.setTo(0, 0);
        this.game.add.tween(this.player.scale).to({x:1, y:1}, 300).start();
        this.player.reset(1, this.game.world.height -195);

        this.score = 0;
        this.scoreText.text = 'Score: 0';

        this.stars.removeAll();
        this.addCoins();
    },

    addLives: function(){
        this.playerDead = false;
        this.lives = 3;
        this.remainingLives = game.add.group();
        this.livesText = this.game.add.text(16, 60, 'Lives : ', { font: '34px Arial', fill: '#fff' });
        for (var i = 0; i < 3; i++)
        {
            this.firstaid = this.remainingLives.create(135 + (30 * i), 80, 'live');
            this.firstaid.anchor.setTo(0.5, 0.5);
            this.firstaid.alpha = 0.4;
        }

        this.livesText.fixedToCamera = true;
        this.remainingLives.fixedToCamera = true;
    },

    setParticles: function() {
        this.exp = game.add.emitter(0, 0, 15);
        this.exp.makeParticles('star');
        this.exp.setYSpeed(-150, 150);
        this.exp.setXSpeed(-350, 250);
        this.exp.gravity = 150;
    },

    shakeEffect: function(g) {
        var move = 5;
        var time = 20;

        this.game.add.tween(g)
            .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
            .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
            .to({y:"-"+move/2}, time).to({y:"+"+move}, time*2).to({y:"-"+move/2}, time)
            .start();

        this.game.add.tween(g)
            .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
            .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
            .to({x:"-"+move/2}, time).to({x:"+"+move}, time*2).to({x:"-"+move/2}, time)
            .start();
    }
}
