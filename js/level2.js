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

        //Added rain
        this.addRain();

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
        this.levelText = this.game.add.text(440, 16, 'Level 2', { fontSize: '32px', fill: '#000' });
        this.levelText.fixedToCamera = true;

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //Detected device
        if (!game.device.desktop)
            this.addMobileInputs();
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

        if ( this.player.position.x > 3080){
            this.music.stop();
            this.rainSound.stop();
            this.game.state.start('Finish');
        }
    },

    inputs: function() {
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown || this.moveLeft)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown || this.moveRight)
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
            this.jumpPlayer();
        }

        if (this.shootButton.isDown)
        {
            this.shoot();
        }
    },

    jumpPlayer: function(){
        if (this.player.body.onFloor())
        {
            this.player.body.velocity.y = -350;
            this.jumpSound.play();
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

    addRain: function(){
        this.emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);

        this.emitter.width = this.game.world.width;

        this.emitter.makeParticles('rain');

        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.5;

        this.emitter.setYSpeed(300, 500);
        this.emitter.setXSpeed(-5, 5);

        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.emitter.start(false, 1600, 5, 0);
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
        this.coinSound = this.game.add.audio('coinSound', 0.3);
        this.jumpSound = this.game.add.audio('jumpSound', 0.3);
        this.deadSound = this.game.add.audio('deadSound', 0.3);
        this.music = this.game.add.audio('musicSound', 0.2);
        this.rainSound = this.game.add.audio('rainSound', 0.2);
        this.shootSound = this.game.add.audio('shootSound', 0.3);
        this.music.play().loopFull();
        this.rainSound.play().loopFull();
    },

    addEnemy: function (){

        this.enemy = this.game.add.group();
        this.enemy.enableBody = true;

        this.enemy1 = this.enemy.create(840, 550, 'enemy');
        this.enemy2 = this.enemy.create(2260, 550, 'enemy');

        this.enemy1.body.gravity.y = 300;
        this.enemy1.body.velocity.x = 250;
        this.enemy2.body.gravity.y = 300;
        this.enemy2.body.velocity.x = 80;

    },

    enemyMove: function(){
        if (parseInt(this.enemy1.body.x) > 1400 ) { this.enemy1.body.velocity.x = -250; }
        if (parseInt(this.enemy1.body.x) < 700 ) { this.enemy1.body.velocity.x = 250; }
        if (parseInt(this.enemy2.body.x) > 2400 ) { this.enemy2.body.velocity.x = -80; }
        if (parseInt(this.enemy2.body.x) < 2200 ) { this.enemy2.body.velocity.x = 80; }
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
            this.rainSound.stop();
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
    },

    addMobileInputs: function() {
        this.jumpButton = game.add.sprite(430, 130, 'jump');
        this.jumpButton.fixedToCamera = true;
        this.jumpButton.inputEnabled = true;
        this.jumpButton.events.onInputDown.add(this.jumpPlayer, this);
        this.jumpButton.alpha = 0.5;

        this.shootButton = game.add.sprite(730, 130, 'shoot');
        this.shootButton.fixedToCamera = true;
        this.shootButton.inputEnabled = true;
        this.shootButton.events.onInputDown.add(this.shoot, this);
        this.shootButton.alpha = 0.5;

        this.moveLeft = false;
        this.moveRight = false;

        this.leftButton = game.add.sprite(10, 130, 'left');
        this.leftButton.fixedToCamera = true;
        this.leftButton.inputEnabled = true;
        this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
        this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
        this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
        this.leftButton.alpha = 0.5;

        this.rightButton = game.add.sprite(110, 130, 'right');
        this.rightButton.fixedToCamera = true;
        this.rightButton.inputEnabled = true;
        this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
        this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
        this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
        this.rightButton.alpha = 0.5;
    }
}
