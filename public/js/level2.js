(function(){
  game.state.add('level2', {create:create, update:update});

  var map, layer, cursors, player, time, timer, txtScore, txtTime, twisters, world1BGM, world2BGM, victoryEmerald, fallOffSound;

  function create(){
    //score = 0;
    time = 90;

    map = game.add.tilemap('mapGold', 16, 16);
    map.addTilesetImage('Oz');
    layer = map.createLayer(0);
    layer.resizeWorld();
    layer.debug = true;

    dieTiles = [6,7,8,14,15,16,22,23,24,30,31,32,38,39,40,41,43,44,46,47,48];
    winTiles = [1,2,3,4,5,9,10,11,12,13,17,18,19,20,21,25,26,27,28,29,33,34,35,36,37];
    map.setTileIndexCallback(dieTiles, offPath.killPlayer, this);
    map.setTileIndexCallback(winTiles, offPath.playerWins, this);

    victoryEmerald = game.add.audio('victoryEmerald');
    world2BGM = game.add.audio('world2BG');
    world2BGM.play();
    //map.setCollisionBetween(54, 83);
    //layer.debug = true;
    fallOffSound = game.add.audio('fallOffSound');

    // Score and timer
    txtScore = game.add.text(10, 10, "score: " + score,   { font: "20px Arial", fill: "#ffffff" });
    txtTime  = game.add.text(10, 35, 'time: ' + time, { font: "20px Arial", fill: "#ffffff" });
    timer = game.time.events.loop(1000, subtractTime);
    txtScore.fixedToCamera = true;
    txtTime.fixedToCamera = true;

    // Player
    player = game.add.sprite(48, 48, 'player', 1);
    player.animations.add('left', [0,1], 10, true);
    player.animations.add('right', [3,4], 10, true);
    player.animations.add('up', [5], 10, true);
    player.animations.add('down', [2], 10, true);

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    game.camera.follow(player);

    player.body.setSize(10, 10, 6, player.body.height - 10);

    // Twisters
    twisters = game.add.group();
    twisters.enableBody = true;
    twisters.physicsBodyType = Phaser.Physics.ARCADE;
    twisters.createMultiple(5, 'twister');
    //twisters.setAll('body.gravity.x', -200);
    twisters.setAll('checkWorldBounds', true);
    twisters.setAll('outOfBoundsKill', true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(levelUp);
  }

  function update(){
    game.physics.arcade.collide(player, layer);
    player.body.velocity.set(0);

    if(cursors.left.isDown){
      player.body.velocity.x = -100;
      player.play('left');
    }else if (cursors.right.isDown){
      player.body.velocity.x = 100;
      player.play('right');
    }else if (cursors.up.isDown){
      player.body.velocity.y = -100;
      player.play('up');
    }else if (cursors.down.isDown){
      player.body.velocity.y = 100;
      player.play('down');
    }else{
      player.animations.stop();
    }
  }

var elapsed = 0;
  function sendTwister(){
    if (time - elapsed < 0 || elapsed === 0){
      var t = twisters.getFirstDead();
      t.reset(840, game.world.randomY);
      elapsed = time - 3;
    }
  }

  function levelUp(){
    game.state.start('menu');
  }

  function subtractTime(){
    time--;
    txtTime.text = 'time: '+ time;
    if(!time)
      game.state.restart();
  }

  var offPath = {
    killPlayer: function () {
      fallOffSound.play();
      player.kill();
      player.reset(48, 48);

      //game.state.start('level2');
    },
    playerWins: function() {
      world2BGM.destroy();
      victoryEmerald.play();
    }
  };


})();
