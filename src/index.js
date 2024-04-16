// Define the gamme configuration
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
// Event listener to Resize the game
window.addEventListener(
    'resize',
    function () {
        game.scale.resize(config.width, window.innerHeight)
    },
    false,
)
// element that will contain the game
const game = new Phaser.Game(config)

// Declare global variables
let player
let platforms
let aKey
let dKey
let gameOverDistance = 0
let enemies
let gameOver = false
let spacebar
let ball
let score = 0
let scoreText
// Preload the game assets
function preload() {
    this.load.image('background_img', 'assets/space3.png')
    this.load.image('playerSprite', 'assets/player.png')
    this.load.image('playerJumpSprite', 'assets/player_jump.png')
    this.load.image('platform', 'assets/galaxy.png')
    this.load.image('enemy', 'assets/blob_default.png')
    this.load.spritesheet('enemyAnims', 'assets/blobs.png', {
        frameWidth: 95,
        frameHeight: 95,
    })
    this.load.spritesheet('ball', 'assets/twinkles_2.png', {
        frameWidth: 90,
        frameHeight: 90,
    })
    this.load.image('player_up', 'assets/player_up.png')
}
// Create elements in the game
function create() {
    // Add the background
    this.add.image(0, 0, 'background_img').setOrigin(0, 0).setScrollFactor(0)

    // Add score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#DEF7EF', }).setScrollFactor(0).setDepth(5);


    // Add animations
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'playerJumpSprite' }, { key: 'playerSprite' }],
        frameRate: 10,
        repeat: 0,
    })

    
    this.anims.create({
        key: 'sparkle',
        frames:'ball',
        frameRate: 20,
        repeat: -1
    })
    
    this.anims.create({
        key: 'shoot',
        frames: [{ key: 'player_up' }, { key: 'playerSprite' }],
        frameRate: 10,
        repeat: 0,       
    })

    this.anims.create({
        key: 'enemy_fly',
        frames: 'enemyAnims',
        frameRate: 7,
        repeat: -1,
        yoyo: true
    })

    // Add the player
    createPlayer(this.physics)
    // Add platforms
    createPlatforms(this.physics)
    // Add enemies
    createEnemies(this.physics)
    // Add projectiles
    createBall(this.physics)
    // Add collisions to player when he jumps up
    this.physics.add.collider(player, platforms, (playerObj, platformObj) => {
        if (platformObj.body.touching.up && playerObj.body.touching.down) {
            player.setVelocityY(-400)
            player.anims.play('jump', true)
        }
    })

    // avoid platforms colliding
    this.physics.add.collider(platforms, platforms, collider => {
        collider.x = Phaser.Math.Between(0, 640)
        collider.refreshBody()
    })

    // avoid enemy colliding with platform
    this.physics.add.collider(platforms, enemies, collider  => {
        collider.x = Phaser.Math.Between(0, 640)
        collider.refreshBody()
    })

    // player collides with enemy
    this.physics.add.collider(player, enemies, (_, enemy) => {
        this.physics.pause()
        gameOver = true
        enemy.anims.stop()
    })

    // enemy collides with ball
    this.physics.add.collider(ball, enemies, (ball, enemy) => {
        enemy.disableBody(true, true)
        ball.disableBody(true, true)
        score += 50
        scoreText.setText(`score: ${score}`)
    })
    // Add camera to follow player
    this.cameras.main.startFollow(player, false, 0, 1)

    createKeys(this.input.keyboard)
}
// Update elements in the game
function update() {
    checkMovement()
    checkBall()
    checkShoot()
    refactorEnemies()
    refactorPlatforms()
    checkGameOver(this.physics)
    updateScore()
    if (gameOver) return
}

function createPlayer(physics) {
    // Create the player
    player = physics.add.sprite(325, -100, 'playerSprite')
    player.setBounce(0, 1)
    player.setVelocityY(-400)
    player.body.setSize(64, 90)
    player.body.setOffset(32, 30)
    player.setDepth(10)
};
function createPlatforms(physics) {
    // Create a group for platforms
    platforms = physics.add.staticGroup()
    // Add platforms
    platforms.create(325, 0, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -200, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -400, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -600, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -800, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -1000, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -1200, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -1400, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -1600, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -1800, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -2000, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -2200, 'platform').setSize(75, 1)
    platforms.create(Phaser.Math.Between(0, 640), -2400, 'platform').setSize(75, 1)
    
    // Add collisions to platforms
    platforms.children.iterate(function (platform) {
        platform.body.checkCollision.down = false
        platform.body.checkCollision.left = false
        platform.body.checkCollision.right = false
    })
}
function createEnemies(physics) {
    // Create a group for enemies
    enemies = physics.add.group()
    // Create a new enemy and add it to the enemies group
    enemies.create(Phaser.Math.Between(0, 640), Phaser.Math.Between(-950, -1300), 'enemy')    
    // Iterate over each enemy and set its properties
    enemies.children.iterate(function (enemy) {
        // Set the size of the enemy
        enemy.body.setSize(66, 66);
        // Disable gravity for enemies
        enemy.body.setAllowGravity(false);
        // Play the enemy_fly animation
        enemy.anims.play('enemy_fly');
    })
}
function createBall(physics) {
    ball= physics.add.sprite(0, 0, 'ball')
    ball.active = false
    ball.body.setAllowGravity(false)
    ball.setSize(30,30)
    ball.anims.play('sparkle')
};
function createKeys(keyboard) {
        // Add controls
        aKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true)
        dKey = keyboard.addKey('D', true, true)
        spacebar = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true, true)
};
function checkMovement() {
    if (aKey.isDown && !dKey.isDown) {
        player.setVelocityX(-300)
        player.flipX = true
        if (player.x < 15) {
            player.x = 615
    }
}
    if (dKey.isDown && !aKey.isDown) {        
        player.setVelocityX(300)
        player.flipX = false
        if (player.x > 615) {
            player.x = 15
        }
    }
    if (!aKey.isDown && !dKey.isDown) {
        player.setVelocityX(0)
    }
}

function checkBall() {
    // Check if the ball sprite is active and if it has passed a certain height
    if (ball.active && ball.startPosition - ball.y > config.height) {
        ball.disableBody(true, true)
    }
}
function checkShoot() {
    if (spacebar.isDown && !ball.active) {
        ball.x = player.x
        ball.y = player.y -45
        player.anims.play('shoot') 
        ball.enableBody(true, ball.x, ball.y, true, true)
        ball.setVelocityY(-800)
        ball.startPosition = ball.y
    }
    
}
// reposition platforms
function refactorPlatforms() {
    let minY = 0;
    let newPlatforms = [];

    platforms.children.iterate(function (platform) {
        if (platform.y < minY) minY = platform.y;
    });

    platforms.children.iterate(function (platform) {
        if (platform.y > player.y && player.body.center.distance(platform.body.center) > 700) {
            let newPlatform = platforms.create(Phaser.Math.Between(0, 640), minY - 200, 'platform').setSize(75, 1);
            newPlatforms.push(newPlatform);
        }
    });

    newPlatforms.forEach(function (platform) {
        platform.refreshBody();
    });
}
// reposition enemies
function refactorEnemies() {
    enemies.children.iterate(function (enemy) {
        if (enemy.y > player.y && player.body.center.distance(enemy.body.center) > 700) {
            enemy.x = Phaser.Math.Between(0, 640)
            enemy.y = enemy.y - Phaser.Math.Between(1000, 800)
            enemy.enableBody(true, enemy.x, enemy.y, true, true)
        }
    })
};
function checkGameOver(physics) {
    // Game over
    if (player.body.y > gameOverDistance) {
        physics.pause()
        gameOver = true
        scoreText.setText('GAME OVER! \nScore: ' + score);
        scoreText.setOrigin(0.5, 0.5); // Zentrieren
        scoreText.setStyle({ font: 'bold 32px Helvetica', align: 'center', color: '#fe019a' });
        scoreText.setShadow(3, 3, 'rgba(144, 255, 59, 0.8)', 10);
        scoreText.setX(config.width / 2); // Horizontal in die Mitte setzen
        scoreText.setY(config.height / 2 - 150); // Horizontal in die Mitte setzen
    } else if (player.body.y * -1 - gameOverDistance * -1 > 600) {
        gameOverDistance = player.body.y + 600
    }
}

function updateScore() {
    if (player.y * -1 > score) {
        score = Math.round(player.y * -1)
        scoreText.setText(`score: ${score}`)
    }
}   