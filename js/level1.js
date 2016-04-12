var Level1 = {

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

        //Added bullet and controls
        this.addBullets();
        this.bulletTime = 0;
        this.shootButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  An explosion pool
        this.addExplosion();

        //  The score
        this.score = 0;
        this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;

        //Level
        this.levelText = this.game.add.text(440, 16, 'Level 1', { fontSize: '32px', fill: '#000' });
        this.levelText.fixedToCamera = true;

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function() {
        this.game.physics.arcade.collide(this.player, this.platformsLayer);
        this.game.physics.arcade.collide(this.stars, this.platformsLayer);
        this.game.physics.arcade.collide(this.enemy, this.platformsLayer);
        this.game.physics.arcade.collide(this.bullets, this.platformsLayer);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.player, this.stars, this.takeCoin, null, this);
        //  Checks to see if the player overlaps with any of the enemy, if he does call the deadPlayer function
        this.game.physics.arcade.overlap(this.player, this.enemy, this.deadPlayer, null, this);
        //  Checks to see if the bullet overlaps with any of the enemy, if he does call the deadPlayer function
        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.deadEnemy, null, this);

        this.inputs();

        this.enemyMove();

        if ( this.player.position.x > 3060){
            this.music.stop();
            this.game.state.start('Level2');
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

        if (this.shootButton.isDown)
        {
            this.shoot();
        }
    },

    addMap: function(){
        this.map = this.game.add.tilemap('tilemapLevel1');
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
        this.shootSound = this.game.add.audio('shoot', 0.3);
        this.music = this.game.add.audio('music', 0.2);
        this.music.play().loopFull();;
    },

    addEnemy: function (){

        this.enemy = this.game.add.group();
        this.enemy.enableBody = true;

        this.enemy1 = this.enemy.create(460, 575, 'enemy');
        this.enemy2 = this.enemy.create(2300, 575, 'enemy');

        this.enemy1.body.gravity.y = 300;
        this.enemy1.body.velocity.x = 80;
        this.enemy2.body.gravity.y = 300;
        this.enemy2.body.velocity.x = 80;

    },

    enemyMove: function(){
        if (parseInt(this.enemy1.body.x) > 550 ) { this.enemy1.body.velocity.x = -80; }
        if (parseInt(this.enemy1.body.x) < 320 ) { this.enemy1.body.velocity.x = 80; }
        if (parseInt(this.enemy2.body.x) > 2400 ) { this.enemy2.body.velocity.x = -80; }
        if (parseInt(this.enemy2.body.x) < 2100 ) { this.enemy2.body.velocity.x = 80; }
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

        this.enemy.removeAll();
        this.addEnemy();

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
    },

    addBullets: function(){
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
    },

    shoot: function(){
        //  To avoid them being allowed to fire too fast we set a time limit
        if (this.game.time.now > this.bulletTime)
        {
            //  Grab the first bullet we can from the pool
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {

                this.shootSound.play();

                //  And fire it
                this.bullet.reset(this.player.x + 8, this.player.y);
                this.bullet.body.velocity.x = + 400;
                this.bulletTime = this.game.time.now + 200;
            }
        }
    },

    deadEnemy: function(bullet, enemy){

        this.deadSound.play();

        //  When a bullet hits an alien we kill them both
        bullet.kill();
        enemy.kill();

        this.explosion = this.explosions.getFirstExists(false);
        this.explosion.reset(enemy.body.x, enemy.body.y);
        this.explosion.play('kaboom', 10, false, true);
    },

    addExplosion: function(){
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(this.createExplosion, this);
    },

    createExplosion: function(explosion) {
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        explosion.animations.add('kaboom');
    }
}