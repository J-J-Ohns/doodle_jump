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
    this.load.image('background_img', 'assets/background.png')
    this.load.image('playerSprite', 'assets/player.png')
    this.load.image('platform', 'assets/game-tiles.png')
}
 
function create() {
    this.add.image(0, 0, 'background_img').setOrigin(0, 0).setScrollFactor(0)

    player = this.physics.add.sprite(325, -100, 'playerSprite')
    player.setBounce(0, 1)
    player.setVelocityY(-400)

    platforms =this.physics.add.staticGroup()
    platforms.create(325, 0, 'platform')

    this.physics.add.collider(player, platforms)

    this.cameras.main.startFollow(player, false, 0, 1)

    aKey = this.input.keyboard.addKey('A', true, true)
    dKey = this.input.keyboard.addKey('D', true, true)

}
 

function update() {
    if (aKey.isDown && !dKey.isDown) {
        player.x > 32 ? player.setVelocityX(-300) : player.setVelocityX(0)
    }
    if (dKey.isDown && !aKey.isDown)
        player.x < 608 ? player.setVelocityX(300) : player.setVelocityX(0)
    }
    if (!aKey.isDown && !dKey.isDown) {
        player.setVelocityX(0)
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
 
 