class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.cursors = null;
        this.wasd = null;
        this.spaceKey = null;
        this.coins = null;
        this.obstacles = null;
        this.score = 0;
        this.scoreText = null;
        this.gameMap = null;
        this.groundLayer = null;
        
        // Attack combo system
        this.isAttacking = false;
        this.comboCount = 0;
        this.comboTimer = null;
        this.comboWindow = 1000; // 1 second window for combo
        
        // Health system
        this.maxHealth = 3;
        this.currentHealth = 3;
        this.hearts = [];
        this.isInvulnerable = false;
        this.invulnerabilityTime = 2000; // 2 seconds of invulnerability after taking damage
        this.isDead = false;
        this.gameOver = false;
    }

    preload() {
        // Load adventurer sprite sheet
        this.load.spritesheet('adventurer', 'characters/Adventurer/adventurer-Sheet.png', {
            frameWidth: 50,  // Each frame is 50px wide
            frameHeight: 37  // Each frame is 37px tall
        });
        
        // Create other sprites programmatically
        this.createSprites();
    }

    createSprites() {
        // Create ground tile
        const groundGraphics = this.add.graphics();
        groundGraphics.fillStyle(0x8B4513); // Brown
        groundGraphics.fillRect(0, 0, 32, 32);
        groundGraphics.generateTexture('ground', 32, 32);
        groundGraphics.destroy();

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

        // Create heart sprite
        const heartGraphics = this.add.graphics();
        heartGraphics.fillStyle(0xFF1744); // Red heart
        // Draw heart shape
        heartGraphics.fillCircle(8, 8, 6);
        heartGraphics.fillCircle(16, 8, 6);
        heartGraphics.fillTriangle(2, 12, 22, 12, 12, 24);
        heartGraphics.generateTexture('heart', 24, 24);
        heartGraphics.destroy();

        // Create empty heart sprite
        const emptyHeartGraphics = this.add.graphics();
        emptyHeartGraphics.lineStyle(2, 0xFF1744);
        emptyHeartGraphics.strokeCircle(8, 8, 6);
        emptyHeartGraphics.strokeCircle(16, 8, 6);
        emptyHeartGraphics.strokeTriangle(2, 12, 22, 12, 12, 24);
        emptyHeartGraphics.generateTexture('emptyHeart', 24, 24);
        emptyHeartGraphics.destroy();
    }

    createAnimations() {
        // Create idle animation
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('adventurer', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // Create run animation
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('adventurer', { start: 8, end: 13 }),
            frameRate: 12,
            repeat: -1
        });

        // Create hurt animation
        this.anims.create({
            key: 'hurt',
            frames: this.anims.generateFrameNumbers('adventurer', { start: 59, end: 61 }),
            frameRate: 10,
            repeat: 0
        });

        // Create death animation
        this.anims.create({
            key: 'die',
            frames: this.anims.generateFrameNumbers('adventurer', { start: 62, end: 68 }),
            frameRate: 8,
            repeat: 0
        });

        // Create attack animations
        this.anims.create({
            key: 'attack1',
            frames: this.anims.generateFrameNumbers('adventurer', { start: 42, end: 46 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'attack2',
            frames: this.anims.generateFrameNumbers('adventurer', { start: 47, end: 52 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'attack3',
            frames: this.anims.generateFrameNumbers('adventurer', { start: 53, end: 58 }),
            frameRate: 15,
            repeat: 0
        });
    }

    create() {
        // Create tile map
        this.createTileMap();
        
        // Create animations for the adventurer
        this.createAnimations();
        
        // Create player with adventurer sprite
        this.player = this.physics.add.sprite(64, 64, 'adventurer');
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(30, 35, 10, 2); // Adjust collision box for adventurer sprite
        this.player.setScale(1.2); // Make the adventurer a bit larger
        
        // Start with idle animation
        this.player.play('idle');

        // Create input controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Set up space key event for attack combo
        this.spaceKey.on('down', this.handleAttack, this);

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

        // Create health UI
        this.createHealthUI();

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
        // Don't allow movement during attack animations or when dead/game over
        if (this.isAttacking || this.isDead || this.gameOver) {
            this.player.setVelocity(0);
            return;
        }

        // Player movement
        const speed = 160;
        
        // Reset velocity
        this.player.setVelocity(0);
        
        // Track if player is moving
        let isMoving = false;

        // Horizontal movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.setVelocityX(-speed);
            this.player.setFlipX(true); // Flip sprite to face left
            isMoving = true;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.setVelocityX(speed);
            this.player.setFlipX(false); // Face right (normal direction)
            isMoving = true;
        }

        // Vertical movement
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.setVelocityY(-speed);
            isMoving = true;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.setVelocityY(speed);
            isMoving = true;
        }

        // Play appropriate animation (only if not attacking)
        if (isMoving) {
            // Only start run animation if not already playing it
            if (this.player.anims.currentAnim?.key !== 'run') {
                this.player.play('run');
            }
        } else {
            // Only start idle animation if not already playing it
            if (this.player.anims.currentAnim?.key !== 'idle') {
                this.player.play('idle');
            }
        }
    }

    handleAttack() {
        // Don't allow new attacks while already attacking
        if (this.isAttacking) {
            return;
        }

        // Increment combo count
        this.comboCount++;
        
        // Clear existing combo timer
        if (this.comboTimer) {
            this.comboTimer.remove();
        }

        // Set attacking state
        this.isAttacking = true;

        // Determine which attack animation to play
        let attackKey;
        if (this.comboCount === 1) {
            attackKey = 'attack1';
        } else if (this.comboCount === 2) {
            attackKey = 'attack2';
        } else if (this.comboCount >= 3) {
            attackKey = 'attack3';
            // Reset combo after the third attack
            this.comboCount = 0;
        }

        // Play the attack animation
        this.player.play(attackKey);

        // Set up animation complete listener
        this.player.once(`animationcomplete-${attackKey}`, () => {
            this.isAttacking = false;
            
            // If this was the third attack, reset combo completely
            if (attackKey === 'attack3') {
                this.comboCount = 0;
            } else {
                // Start combo timer for next attack
                this.comboTimer = this.time.delayedCall(this.comboWindow, () => {
                    this.comboCount = 0; // Reset combo if no input within window
                });
            }
            
            // Return to idle animation
            this.player.play('idle');
        });

        // Add visual feedback for combo
        this.showComboFeedback();
    }

    showComboFeedback() {
        // Create combo text
        let comboText;
        if (this.comboCount === 1) {
            comboText = 'ATTACK!';
        } else if (this.comboCount === 2) {
            comboText = 'COMBO x2!';
        } else if (this.comboCount === 3) {
            comboText = 'COMBO x3!';
        }

        // Display combo feedback
        const feedback = this.add.text(this.player.x, this.player.y - 50, comboText, {
            fontSize: '16px',
            fill: '#FF6B35',
            fontStyle: 'bold'
        });
        feedback.setOrigin(0.5);

        // Animate the feedback text
        this.tweens.add({
            targets: feedback,
            y: feedback.y - 30,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                feedback.destroy();
            }
        });
    }

    createHealthUI() {
        // Create hearts display
        for (let i = 0; i < this.maxHealth; i++) {
            const heart = this.add.image(16 + (i * 32), 60, 'heart');
            heart.setScrollFactor(0); // Keep hearts fixed on screen
            heart.setScale(1.2);
            this.hearts.push(heart);
        }
    }

    updateHealthUI() {
        // Update heart display based on current health
        for (let i = 0; i < this.hearts.length; i++) {
            if (i < this.currentHealth) {
                this.hearts[i].setTexture('heart');
            } else {
                this.hearts[i].setTexture('emptyHeart');
            }
        }
    }

    takeDamage() {
        // Don't take damage if already dead or invulnerable
        if (this.isDead || this.isInvulnerable) {
            return;
        }

        // Reduce health
        this.currentHealth--;
        this.updateHealthUI();

        // Check if dead
        if (this.currentHealth <= 0) {
            this.playerDie();
        } else {
            // Set invulnerability period
            this.isInvulnerable = true;
            this.time.delayedCall(this.invulnerabilityTime, () => {
                this.isInvulnerable = false;
            });

            // Visual feedback for invulnerability
            this.tweens.add({
                targets: this.player,
                alpha: 0.5,
                duration: 200,
                yoyo: true,
                repeat: 9, // Flash for 2 seconds
                onComplete: () => {
                    this.player.setAlpha(1);
                }
            });
        }
    }

    playerDie() {
        this.isDead = true;
        this.isAttacking = false;
        
        // Stop player movement
        this.player.setVelocity(0);
        
        // Play death animation
        this.player.play('die');
        
        // Show game over after death animation
        this.player.once('animationcomplete-die', () => {
            this.showGameOver();
        });
    }

    showGameOver() {
        this.gameOver = true;
        
        // Create dark overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, 800, 600);
        overlay.setScrollFactor(0);

        // Game Over title
        const gameOverText = this.add.text(400, 200, 'GAME OVER', {
            fontSize: '48px',
            fill: '#FF0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setScrollFactor(0);

        // Subtitle
        const subtitleText = this.add.text(400, 280, 'The adventure ends here...', {
            fontSize: '24px',
            fill: '#FFFFFF',
            fontStyle: 'italic'
        });
        subtitleText.setOrigin(0.5);
        subtitleText.setScrollFactor(0);

        // Score display
        const finalScoreText = this.add.text(400, 340, `Final Score: ${this.score}`, {
            fontSize: '28px',
            fill: '#FFD700',
            fontStyle: 'bold'
        });
        finalScoreText.setOrigin(0.5);
        finalScoreText.setScrollFactor(0);

        // Restart instruction
        const restartText = this.add.text(400, 420, 'Press ANY KEY to restart your journey!', {
            fontSize: '20px',
            fill: '#00FF00',
            fontStyle: 'bold'
        });
        restartText.setOrigin(0.5);
        restartText.setScrollFactor(0);

        // Add blinking effect to restart text
        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Set up restart functionality
        this.input.keyboard.once('keydown', () => {
            this.restartGame();
        });
    }

    restartGame() {
        // Reset all game state
        this.currentHealth = this.maxHealth;
        this.score = 0;
        this.isDead = false;
        this.gameOver = false;
        this.isAttacking = false;
        this.isInvulnerable = false;
        this.comboCount = 0;
        
        // Clear any existing timers
        if (this.comboTimer) {
            this.comboTimer.remove();
        }

        // Restart the scene
        this.scene.restart();
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
        // Don't take damage if already dead or invulnerable
        if (this.isDead || this.isInvulnerable) {
            return;
        }

        // Simple knockback effect
        const knockbackForce = 200;
        const angle = Phaser.Math.Angle.Between(obstacle.x, obstacle.y, player.x, player.y);
        
        player.setVelocity(
            Math.cos(angle) * knockbackForce,
            Math.sin(angle) * knockbackForce
        );

        // Play hurt animation
        player.play('hurt');

        // Take damage
        this.takeDamage();

        // Return to idle after hurt animation completes
        player.once('animationcomplete-hurt', () => {
            if (!this.isDead) {
                player.play('idle');
            }
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
