class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.cursors = null;
        this.wasd = null;
        this.coins = null;
        this.obstacles = null;
        this.score = 0;
        this.scoreText = null;
        this.gameMap = null;
        this.groundLayer = null;
    }

    preload() {
        // Create better sprites programmatically
        this.createSprites();
    }

    createSprites() {
        // Create ground tile
        const groundGraphics = this.add.graphics();
        groundGraphics.fillStyle(0x8B4513); // Brown
        groundGraphics.fillRect(0, 0, 32, 32);
        groundGraphics.generateTexture('ground', 32, 32);
        groundGraphics.destroy();

        // Create player sprite
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x0066CC); // Blue
        playerGraphics.fillRect(4, 4, 24, 24);
        playerGraphics.fillStyle(0xFFFFFF); // White eyes
        playerGraphics.fillRect(8, 8, 4, 4);
        playerGraphics.fillRect(20, 8, 4, 4);
        playerGraphics.generateTexture('player', 32, 32);
        playerGraphics.destroy();

        // Create coin sprite
        const coinGraphics = this.add.graphics();
        coinGraphics.fillStyle(0xFFD700); // Gold
        coinGraphics.fillCircle(16, 16, 12);
        coinGraphics.fillStyle(0xFFA500); // Orange center
        coinGraphics.fillCircle(16, 16, 6);
        coinGraphics.generateTexture('coin', 32, 32);
        coinGraphics.destroy();

        // Create obstacle sprite
        const obstacleGraphics = this.add.graphics();
        obstacleGraphics.fillStyle(0x8B0000); // Dark red
        obstacleGraphics.fillRect(0, 0, 32, 32);
        obstacleGraphics.fillStyle(0xFF0000); // Red highlight
        obstacleGraphics.fillRect(4, 4, 24, 4);
        obstacleGraphics.generateTexture('obstacle', 32, 32);
        obstacleGraphics.destroy();

        // Create grass tile
        const grassGraphics = this.add.graphics();
        grassGraphics.fillStyle(0x228B22); // Forest green
        grassGraphics.fillRect(0, 0, 32, 32);
        grassGraphics.fillStyle(0x32CD32); // Lime green highlights
        grassGraphics.fillRect(2, 2, 4, 4);
        grassGraphics.fillRect(10, 6, 3, 3);
        grassGraphics.fillRect(20, 4, 4, 4);
        grassGraphics.fillRect(6, 20, 3, 3);
        grassGraphics.fillRect(25, 25, 4, 4);
        grassGraphics.generateTexture('grass', 32, 32);
        grassGraphics.destroy();
    }

    create() {
        // Create tile map
        this.createTileMap();
        
        // Create player
        this.player = this.physics.add.sprite(64, 64, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(24, 24, 4, 4); // Adjust collision box

        // Create input controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');

        // Create coins group
        this.coins = this.physics.add.group();
        this.createCoins();

        // Create obstacles group
        this.obstacles = this.physics.add.group();
        this.createObstacles();

        // Add collisions
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);

        // Create UI
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 10, y: 5 }
        });

        // Set camera to follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1.5);
    }

    createTileMap() {
        // Create a simple tile map using a 2D array
        const mapData = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        // Create tiles based on the map data
        for (let y = 0; y < mapData.length; y++) {
            for (let x = 0; x < mapData[y].length; x++) {
                const tileType = mapData[y][x];
                if (tileType === 1) {
                    // Ground/wall tile
                    this.add.image(x * 32 + 16, y * 32 + 16, 'ground');
                } else {
                    // Grass tile
                    this.add.image(x * 32 + 16, y * 32 + 16, 'grass');
                }
            }
        }

        // Set world bounds
        this.physics.world.setBounds(0, 0, mapData[0].length * 32, mapData.length * 32);
    }

    createCoins() {
        // Create coins at random positions
        const coinPositions = [
            { x: 160, y: 160 },
            { x: 320, y: 96 },
            { x: 480, y: 224 },
            { x: 640, y: 128 },
            { x: 256, y: 352 },
            { x: 544, y: 416 },
            { x: 128, y: 288 },
            { x: 416, y: 320 }
        ];

        coinPositions.forEach(pos => {
            const coin = this.physics.add.sprite(pos.x, pos.y, 'coin');
            coin.body.setSize(24, 24, 4, 4);
            this.coins.add(coin);
            
            // Add a subtle floating animation
            this.tweens.add({
                targets: coin,
                y: pos.y - 5,
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        });
    }

    createObstacles() {
        // Create obstacles at strategic positions
        const obstaclePositions = [
            { x: 224, y: 128 },
            { x: 384, y: 192 },
            { x: 576, y: 256 },
            { x: 192, y: 384 },
            { x: 448, y: 384 },
            { x: 352, y: 288 }
        ];

        obstaclePositions.forEach(pos => {
            const obstacle = this.physics.add.sprite(pos.x, pos.y, 'obstacle');
            obstacle.body.setSize(32, 32);
            obstacle.setImmovable(true);
            this.obstacles.add(obstacle);
        });
    }

    update() {
        // Player movement
        const speed = 160;
        
        // Reset velocity
        this.player.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
        }

        // Vertical movement
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(speed);
        }
    }

    collectCoin(player, coin) {
        // Remove coin and increase score
        coin.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Check if all coins collected
        if (this.coins.children.size === 0) {
            this.showVictory();
        }
    }

    hitObstacle(player, obstacle) {
        // Simple knockback effect
        const knockbackForce = 200;
        const angle = Phaser.Math.Angle.Between(obstacle.x, obstacle.y, player.x, player.y);
        
        player.setVelocity(
            Math.cos(angle) * knockbackForce,
            Math.sin(angle) * knockbackForce
        );

        // Flash effect
        this.tweens.add({
            targets: player,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 3
        });
    }

    showVictory() {
        // Display victory message
        const victoryText = this.add.text(400, 300, 'YOU WIN!\nAll coins collected!', {
            fontSize: '32px',
            fill: '#FFD700',
            backgroundColor: '#000',
            padding: { x: 20, y: 10 },
            align: 'center'
        });
        victoryText.setOrigin(0.5);
        victoryText.setScrollFactor(0); // Keep it fixed on screen

        // Add restart instruction
        const restartText = this.add.text(400, 400, 'Refresh page to play again', {
            fontSize: '18px',
            fill: '#FFF',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        });
        restartText.setOrigin(0.5);
        restartText.setScrollFactor(0); // Keep it fixed on screen
    }
}
