const config = {
    type: Phaser.AUTO,
    width: 640,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
 }
 
 const game = new Phaser.Game(config)
 let player
 let platforms
 let cursor
 
 window.addEventListener(
    'resize',
    function () {
        game.scale.resize(config.width, window.innerHeight)
    },
    false,
 )

 function preload() {
    this.load.image('background_img', 'assets/space2.png')
    this.load.image('playerSprite', 'assets/player.png')
    this.load.image('playerJumpSprite', 'assets/player_jump.png')
    this.load.image('platform', 'assets/galaxy.png')
}
 
function create() {
    this.add.image(0, 0, 'background_img').setOrigin(0, 0).setScrollFactor(0);

    platforms = this.physics.add.staticGroup();

    platforms.create(320, 0, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(320, 490), -200, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(0, 170), -400, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(490, 640), -600, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(320, 640), -1200, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(170, 320), -1400, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(320, 640), -1600, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(0, 640), -1800, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(0, 640), -2000, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    platforms.create(Phaser.Math.Between(0, 640), -2200, 'platform').setSize(150, 1).setOffset(150 - 150 / 2, 60);
    

    player = this.physics.add.sprite(325, -400, 'playerSprite');
    player.setBounce(0, 1);
    player.setVelocityY(-450);

    player.setSize(50, 90);

    this.anims.create({
        key: 'jump',
        frames: [{ key: 'playerJumpSprite' }, { key: 'playerSprite' }],
        frameRate: 10,
        repeat: 0,
    });

    this.physics.add.collider(player, platforms, () => {
        player.anims.play('jump', true);
    });

    this.cameras.main.startFollow(player, false, 0, 1);

    aKey = this.input.keyboard.addKey('A', true, true);
    dKey = this.input.keyboard.addKey('D', true, true);
}


function update() {
    if (aKey.isDown && !dKey.isDown) {
        player.x > 32 ? player.setVelocityX(-300) : player.setVelocityX(0);
    }
    if (dKey.isDown && !aKey.isDown) {
        player.x < 608 ? player.setVelocityX(300) : player.setVelocityX(0);
    }
    if (!aKey.isDown && !dKey.isDown) {
        player.setVelocityX(0);
    }
}



// function create() {
//     cursor = this.input.keyboard.createCursorKeys()
// }

// function update() {
//     if (cursor.left.isDown && !cursor.right.isDown) {
//         player.x > 32 ? player.setVelocityX(-300) : player.setVelocityX(0)
//     }
//     if (cursor.right.isDown && !cursor.left.isDown) {
//         player.x < 608 ? player.setVelocityX(300) : player.setVelocityX(0)
//     }
//     if (!cursor.left.isDown && !cursor.right.isDown) {
//         player.setVelocityX(0)
//     }
// }
 
 