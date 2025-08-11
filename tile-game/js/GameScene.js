class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.player = null;
        this.cursors = null;
        this.wasd = null;
        this.spaceKey = null;
        this.coins = null;
        this.obstacles = null;
        this.enemies = null;
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
        
        // Load orc sprite sheets
        this.load.spritesheet('orc_idle', 'characters/Orcs/Free-Top-Down-Orc-Game-Character-Pixel-Art/Tiled_files/orc1_idle_full.png', {
            frameWidth: 64,  // Adjust based on actual frame size
            frameHeight: 64  // Adjust based on actual frame size
        });
        this.load.spritesheet('orc_walk', 'characters/Orcs/Free-Top-Down-Orc-Game-Character-Pixel-Art/Tiled_files/orc1_walk_full.png', {
            frameWidth: 64,  // Each frame is 64px wide
            frameHeight: 64  // Each frame is 64px tall
        });
        this.load.spritesheet('orc_attack', 'characters/Orcs/Free-Top-Down-Orc-Game-Character-Pixel-Art/Tiled_files/orc1_attack_full.png', {
            frameWidth: 64,  // Each frame is 64px wide
            frameHeight: 64  // Each frame is 64px tall
        });
        this.load.spritesheet('orc_hurt', 'characters/Orcs/Free-Top-Down-Orc-Game-Character-Pixel-Art/Tiled_files/orc1_hurt_full.png', {
            frameWidth: 64,  // Each frame is 64px wide
            frameHeight: 64  // Each frame is 64px tall
        });
        this.load.spritesheet('orc_death', 'characters/Orcs/Free-Top-Down-Orc-Game-Character-Pixel-Art/Tiled_files/orc1_death_full.png', {
            frameWidth: 64,  // Each frame is 64px wide
            frameHeight: 64  // Each frame is 64px tall
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
        // Check if animations already exist to prevent duplicates
        if (this.anims.exists('idle')) {
            return; // Animations already created, skip
        }

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

        // Create orc animations
        this.anims.create({
            key: 'orc_idle_anim',
            frames: this.anims.generateFrameNumbers('orc_idle', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        // Create directional orc walk animations
        // Row 1: Walking downward (frames 0-5)
        this.anims.create({
            key: 'orc_walk_down',
            frames: this.anims.generateFrameNumbers('orc_walk', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // Row 2: Walking upward (frames 6-11)
        this.anims.create({
            key: 'orc_walk_up',
            frames: this.anims.generateFrameNumbers('orc_walk', { start: 6, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        // Row 3: Walking left (frames 12-17)
        this.anims.create({
            key: 'orc_walk_left',
            frames: this.anims.generateFrameNumbers('orc_walk', { start: 12, end: 17 }),
            frameRate: 8,
            repeat: -1
        });

        // Row 4: Walking right (frames 18-23)
        this.anims.create({
            key: 'orc_walk_right',
            frames: this.anims.generateFrameNumbers('orc_walk', { start: 18, end: 23 }),
            frameRate: 8,
            repeat: -1
        });

        // Create directional orc attack animations (8 frames per row) - slower frame rate
        // Row 1: Attacking downward (frames 0-7)
        this.anims.create({
            key: 'orc_attack_down',
            frames: this.anims.generateFrameNumbers('orc_attack', { start: 0, end: 7 }),
            frameRate: 6,  // Slower frame rate for better visibility
            repeat: 0
        });

        // Row 2: Attacking upward (frames 8-15)
        this.anims.create({
            key: 'orc_attack_up',
            frames: this.anims.generateFrameNumbers('orc_attack', { start: 8, end: 15 }),
            frameRate: 6,  // Slower frame rate for better visibility
            repeat: 0
        });

        // Row 3: Attacking left (frames 16-23)
        this.anims.create({
            key: 'orc_attack_left',
            frames: this.anims.generateFrameNumbers('orc_attack', { start: 16, end: 23 }),
            frameRate: 6,  // Slower frame rate for better visibility
            repeat: 0
        });

        // Row 4: Attacking right (frames 24-31)
        this.anims.create({
            key: 'orc_attack_right',
            frames: this.anims.generateFrameNumbers('orc_attack', { start: 24, end: 31 }),
            frameRate: 6,  // Slower frame rate for better visibility
            repeat: 0
        });

        // Create directional orc hurt animations
        // Row 1: Hurt downward (frames 0-5)
        this.anims.create({
            key: 'orc_hurt_down',
            frames: this.anims.generateFrameNumbers('orc_hurt', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });

        // Row 2: Hurt upward (frames 6-11)
        this.anims.create({
            key: 'orc_hurt_up',
            frames: this.anims.generateFrameNumbers('orc_hurt', { start: 6, end: 11 }),
            frameRate: 8,
            repeat: 0
        });

        // Row 3: Hurt left (frames 12-17)
        this.anims.create({
            key: 'orc_hurt_left',
            frames: this.anims.generateFrameNumbers('orc_hurt', { start: 12, end: 17 }),
            frameRate: 8,
            repeat: 0
        });

        // Row 4: Hurt right (frames 18-23)
        this.anims.create({
            key: 'orc_hurt_right',
            frames: this.anims.generateFrameNumbers('orc_hurt', { start: 18, end: 23 }),
            frameRate: 8,
            repeat: 0
        });

        // Create directional orc death animations (8 frames per row)
        // Row 1: Death downward (frames 0-7)
        this.anims.create({
            key: 'orc_death_down',
            frames: this.anims.generateFrameNumbers('orc_death', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: 0
        });

        // Row 2: Death upward (frames 8-15)
        this.anims.create({
            key: 'orc_death_up',
            frames: this.anims.generateFrameNumbers('orc_death', { start: 8, end: 15 }),
            frameRate: 8,
            repeat: 0
        });

        // Row 3: Death left (frames 16-23)
        this.anims.create({
            key: 'orc_death_left',
            frames: this.anims.generateFrameNumbers('orc_death', { start: 16, end: 23 }),
            frameRate: 8,
            repeat: 0
        });

        // Row 4: Death right (frames 24-31)
        this.anims.create({
            key: 'orc_death_right',
            frames: this.anims.generateFrameNumbers('orc_death', { start: 24, end: 31 }),
            frameRate: 8,
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

        // Create enemies group
        this.enemies = this.physics.add.group();
        this.createEnemies();

        // Add collisions
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        // Remove proximity damage - player only takes damage from orc attacks, not from being near orcs
        
        // Add attack collision detection - but don't prevent movement
        this.physics.add.overlap(this.player, this.enemies, this.checkPlayerAttackHit, null, this);

        // Create UI
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#000',
            backgroundColor: '#fff',
            padding: { x: 10, y: 5 }
        });

        // Create health UI
        this.createHealthUI();
        
        // Create player proximity hearts (initially hidden)
        this.playerProximityHearts = [];
        for (let i = 0; i < this.maxHealth; i++) {
            const heart = this.add.image(0, 0, 'heart');
            heart.setScale(0.6);
            heart.setVisible(false);
            this.playerProximityHearts.push(heart);
        }

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

    createEnemies() {
        // Create orc enemies with patrol behavior
        const enemyData = [
            // Horizontal patrol enemies (left-right movement)
            { x: 224, y: 128, direction: 'horizontal', patrolDistance: 160 },
            { x: 384, y: 192, direction: 'horizontal', patrolDistance: 160 },
            { x: 576, y: 256, direction: 'horizontal', patrolDistance: 160 },
            
            // Vertical patrol enemies (up-down movement)
            { x: 192, y: 384, direction: 'vertical', patrolDistance: 160 },
            { x: 448, y: 384, direction: 'vertical', patrolDistance: 160 },
            { x: 352, y: 288, direction: 'vertical', patrolDistance: 160 }
        ];

        enemyData.forEach(data => {
            const enemy = this.physics.add.sprite(data.x, data.y, 'orc_walk');
            enemy.body.setSize(32, 32);
            enemy.setScale(1.1); // Make orcs similar size to player
            
            // Store patrol data on the enemy
            enemy.patrolDirection = data.direction;
            enemy.patrolDistance = data.patrolDistance;
            enemy.startX = data.x;
            enemy.startY = data.y;
            enemy.patrolSpeed = 50;
            enemy.movingPositive = true; // true = right/down, false = left/up
            
            // Add proximity detection for orcs
            enemy.isNearPlayer = false;
            enemy.detectionRange = 60; // Reduced detection range - player must be closer
            
            // Add orc health system
            enemy.maxHealth = 5;
            enemy.currentHealth = 5;
            enemy.isDead = false;
            enemy.isHurt = false;
            enemy.isAttacking = false;
            enemy.currentDirection = data.direction === 'horizontal' ? 'right' : 'down';
            
            // Add synchronized but random attack timing
            enemy.attackCooldown = false;
            enemy.attackPattern = {
                warningTime: 1000,    // 1 second warning before attack
                attackWindow: 500,    // 0.5 second attack window
                cooldownTime: Phaser.Math.Between(2000, 4000), // Random 2-4 second cooldown
                isWarning: false,
                warningTimer: null
            };
            
            // Set initial velocity and animation based on patrol direction
            if (data.direction === 'horizontal') {
                enemy.setVelocityX(enemy.patrolSpeed);
                enemy.play('orc_walk_right'); // Start walking right
            } else {
                enemy.setVelocityY(enemy.patrolSpeed);
                enemy.play('orc_walk_down'); // Start walking down
            }
            
            this.enemies.add(enemy);
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

        // Update enemy patrol behavior
        this.updateEnemyPatrol();
    }

    updateEnemyPatrol() {
        // Check if player is near any enemy
        let playerNearAnyEnemy = false;
        
        this.enemies.children.entries.forEach(enemy => {
            // Check distance to player
            const distanceToPlayer = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );
            
            // Update player proximity status
            enemy.isNearPlayer = distanceToPlayer <= enemy.detectionRange;
            
            if (enemy.isNearPlayer) {
                playerNearAnyEnemy = true;
            }
        });
        
        // Show/hide player health hearts based on proximity to any enemy
        this.playerProximityHearts.forEach((heart, index) => {
            if (playerNearAnyEnemy) {
                heart.setVisible(true);
                heart.setPosition(this.player.x - 20 + (index * 15), this.player.y - 40);
                if (index < this.currentHealth) {
                    heart.setTexture('heart');
                } else {
                    heart.setTexture('emptyHeart');
                }
            } else {
                heart.setVisible(false);
            }
        });
        
        this.enemies.children.entries.forEach(enemy => {
            
            // Stop movement if player is near, otherwise continue patrol
            if (enemy.isNearPlayer) {
                // Stop moving and play idle animation
                enemy.setVelocity(0);
                if (enemy.anims.currentAnim?.key !== 'orc_idle_anim') {
                    enemy.play('orc_idle_anim');
                }
                
                // Synchronized but random attack system
                if (!enemy.attackCooldown && !enemy.attackPattern.isWarning) {
                    // Start warning phase
                    enemy.attackPattern.isWarning = true;
                    
                    // Show warning indicator
                    this.showAttackWarning(enemy);
                    
                    // Set warning timer
                    enemy.attackPattern.warningTimer = this.time.delayedCall(enemy.attackPattern.warningTime, () => {
                        // Execute attack after warning period
                        this.orcAttackPlayer(enemy);
                        enemy.attackPattern.isWarning = false;
                        enemy.attackCooldown = true;
                        
                        // Reset attack cooldown with random timing
                        enemy.attackPattern.cooldownTime = Phaser.Math.Between(2000, 4000);
                        this.time.delayedCall(enemy.attackPattern.cooldownTime, () => {
                            enemy.attackCooldown = false;
                        });
                    });
                }
                
                return; // Skip patrol logic
            }
            
            // Normal patrol behavior when player is not near
            if (enemy.patrolDirection === 'horizontal') {
                // Horizontal patrol (left-right)
                const distanceFromStart = enemy.x - enemy.startX;
                
                if (enemy.movingPositive) {
                    // Moving right
                    if (distanceFromStart >= enemy.patrolDistance) {
                        // Reached right limit, turn around
                        enemy.movingPositive = false;
                        enemy.setVelocityX(-enemy.patrolSpeed);
                        enemy.play('orc_walk_left'); // Change to left walking animation
                    } else {
                        // Continue moving right
                        enemy.setVelocityX(enemy.patrolSpeed);
                        if (enemy.anims.currentAnim?.key !== 'orc_walk_right') {
                            enemy.play('orc_walk_right');
                        }
                    }
                } else {
                    // Moving left
                    if (distanceFromStart <= -enemy.patrolDistance) {
                        // Reached left limit, turn around
                        enemy.movingPositive = true;
                        enemy.setVelocityX(enemy.patrolSpeed);
                        enemy.play('orc_walk_right'); // Change to right walking animation
                    } else {
                        // Continue moving left
                        enemy.setVelocityX(-enemy.patrolSpeed);
                        if (enemy.anims.currentAnim?.key !== 'orc_walk_left') {
                            enemy.play('orc_walk_left');
                        }
                    }
                }
            } else {
                // Vertical patrol (up-down)
                const distanceFromStart = enemy.y - enemy.startY;
                
                if (enemy.movingPositive) {
                    // Moving down
                    if (distanceFromStart >= enemy.patrolDistance) {
                        // Reached bottom limit, turn around
                        enemy.movingPositive = false;
                        enemy.setVelocityY(-enemy.patrolSpeed);
                        enemy.play('orc_walk_up'); // Change to up walking animation
                    } else {
                        // Continue moving down
                        enemy.setVelocityY(enemy.patrolSpeed);
                        if (enemy.anims.currentAnim?.key !== 'orc_walk_down') {
                            enemy.play('orc_walk_down');
                        }
                    }
                } else {
                    // Moving up
                    if (distanceFromStart <= -enemy.patrolDistance) {
                        // Reached top limit, turn around
                        enemy.movingPositive = true;
                        enemy.setVelocityY(enemy.patrolSpeed);
                        enemy.play('orc_walk_down'); // Change to down walking animation
                    } else {
                        // Continue moving up
                        enemy.setVelocityY(-enemy.patrolSpeed);
                        if (enemy.anims.currentAnim?.key !== 'orc_walk_up') {
                            enemy.play('orc_walk_up');
                        }
                    }
                }
            }
        });
    }

    handleAttack() {
        // Don't allow new attacks while already attacking, dead, or game over
        if (this.isAttacking || this.isDead || this.gameOver) {
            console.log('ATTACK BLOCKED - Reason:', {
                isAttacking: this.isAttacking,
                isDead: this.isDead,
                gameOver: this.gameOver
            });
            return;
        }

        console.log('=== ATTACK STARTED ===');
        
        // Increment combo count
        this.comboCount++;
        
        // Clear existing combo timer
        if (this.comboTimer) {
            this.comboTimer.remove();
        }

        // Set attacking state
        this.isAttacking = true;
        console.log('isAttacking set to TRUE');

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

        console.log('Playing attack animation:', attackKey);

        // Play the attack animation
        this.player.play(attackKey);

        // Use timer-based approach instead of animation completion events
        // Calculate attack duration based on animation frames and frame rate
        const attackDuration = attackKey === 'attack1' ? 333 : attackKey === 'attack2' ? 400 : 400; // milliseconds
        
        console.log('Setting attack timer for', attackDuration, 'ms');
        
        // Set timer to end attack
        this.time.delayedCall(attackDuration, () => {
            console.log('=== ATTACK TIMER COMPLETE ===');
            console.log('Setting isAttacking to FALSE');
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
            console.log('Returning to idle animation');
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
        console.log('=== PLAYER DEATH TRIGGERED ===');
        this.isDead = true;
        this.isAttacking = false;
        
        // Stop player movement
        this.player.setVelocity(0);
        
        // Clear any existing timers
        if (this.comboTimer) {
            this.comboTimer.remove();
        }
        
        // Play death animation
        console.log('Playing death animation');
        this.player.play('die');
        
        // Show game over after death animation with fallback
        this.player.once('animationcomplete-die', () => {
            console.log('Death animation complete, showing game over');
            this.showGameOver();
        });
        
        // Fallback timer in case death animation doesn't complete
        this.time.delayedCall(3000, () => {
            if (this.isDead && !this.gameOver) {
                console.log('FALLBACK: Forcing game over after 3 seconds');
                this.showGameOver();
            }
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

    hitEnemy(player, enemy) {
        // Don't take damage if already dead or invulnerable
        if (this.isDead || this.isInvulnerable) {
            return;
        }

        // Simple knockback effect
        const knockbackForce = 200;
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        
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

    orcAttackPlayer(enemy) {
        // Don't attack if player is already dead or invulnerable
        if (this.isDead || this.isInvulnerable) {
            return;
        }

        // Check if player is still in range when attack executes
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.player.x, this.player.y, enemy.x, enemy.y
        );
        
        // If player moved away during warning, miss the attack
        if (distanceToPlayer > enemy.detectionRange) {
            // Show miss feedback
            const missText = this.add.text(enemy.x, enemy.y - 30, 'MISS!', {
                fontSize: '14px',
                fill: '#FFFF00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            });
            missText.setOrigin(0.5);

            // Animate miss feedback
            this.tweens.add({
                targets: missText,
                y: missText.y - 20,
                alpha: 0,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    missText.destroy();
                }
            });

            // Still play attack animation but no damage
            enemy.isAttacking = true;
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
            const attackDirection = this.getDirectionFromAngle(angle);
            const attackAnim = `orc_attack_${attackDirection}`;
            
            // Force stop current animation and play attack
            enemy.anims.stop();
            enemy.play(attackAnim);

            // Return orc to idle after attack animation completes
            enemy.once(`animationcomplete-${attackAnim}`, () => {
                enemy.isAttacking = false;
                enemy.play('orc_idle_anim');
            });

            return; // Exit without damaging player
        }

        // Set orc as attacking
        enemy.isAttacking = true;

        // Determine attack direction based on player position
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
        const attackDirection = this.getDirectionFromAngle(angle);
        const attackAnim = `orc_attack_${attackDirection}`;

        // Force stop current animation and play attack
        enemy.anims.stop();
        enemy.play(attackAnim);

        // Store attack data for delayed damage application
        enemy.pendingAttack = {
            angle: angle,
            targetX: this.player.x,
            targetY: this.player.y
        };

        // Apply damage after attack animation reaches the hit frame (around 60% through the animation)
        // Attack animations have 8 frames at 6fps = ~1333ms total, hit occurs around frame 5 = ~833ms
        const hitTiming = 833; // milliseconds until hit frame
        
        this.time.delayedCall(hitTiming, () => {
            // Only apply damage if player is still in range and orc is still attacking
            if (enemy.isAttacking && enemy.pendingAttack) {
                const currentDistance = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, enemy.x, enemy.y
                );
                
                if (currentDistance <= enemy.detectionRange && !this.isDead && !this.isInvulnerable) {
                    // Calculate knockback direction (away from orc)
                    const knockbackForce = 400; // Strong knockback force
                    
                    // Apply knockback velocity
                    this.player.setVelocity(
                        Math.cos(enemy.pendingAttack.angle) * knockbackForce,
                        Math.sin(enemy.pendingAttack.angle) * knockbackForce
                    );

                    // Play hurt animation
                    this.player.play('hurt');

                    // Take damage
                    this.takeDamage();

                    // Show attack feedback
                    const attackText = this.add.text(enemy.x, enemy.y - 30, 'ORC ATTACK!', {
                        fontSize: '14px',
                        fill: '#FF0000',
                        fontStyle: 'bold',
                        stroke: '#FFFFFF',
                        strokeThickness: 2
                    });
                    attackText.setOrigin(0.5);

                    // Animate attack feedback
                    this.tweens.add({
                        targets: attackText,
                        y: attackText.y - 20,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            attackText.destroy();
                        }
                    });

                    // Return player to idle after hurt animation completes
                    this.player.once('animationcomplete-hurt', () => {
                        if (!this.isDead) {
                            this.player.play('idle');
                        }
                    });
                } else {
                    // Player escaped, show miss feedback
                    const missText = this.add.text(enemy.x, enemy.y - 30, 'ESCAPED!', {
                        fontSize: '14px',
                        fill: '#00FF00',
                        fontStyle: 'bold',
                        stroke: '#000000',
                        strokeThickness: 2
                    });
                    missText.setOrigin(0.5);

                    this.tweens.add({
                        targets: missText,
                        y: missText.y - 20,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Power2',
                        onComplete: () => {
                            missText.destroy();
                        }
                    });
                }
                
                // Clear pending attack
                enemy.pendingAttack = null;
            }
        });

        // Return orc to idle after attack animation completes
        enemy.once(`animationcomplete-${attackAnim}`, () => {
            enemy.isAttacking = false;
            enemy.pendingAttack = null; // Clear any pending attack
            enemy.play('orc_idle_anim');
        });
    }

    checkPlayerAttackHit(player, enemy) {
        // Only damage orc if player is attacking and orc is not dead
        if (!this.isAttacking || enemy.isDead || enemy.isHurt) {
            return;
        }

        // Check if player is attacking from behind (safer position)
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        const enemyFacing = this.getEnemyFacingDirection(enemy);
        const playerDirection = this.getDirectionFromAngle(angle);
        
        // Only allow damage if attacking from behind or sides
        if (this.isPlayerBehindEnemy(enemyFacing, playerDirection)) {
            this.damageOrc(enemy);
        }
    }

    getEnemyFacingDirection(enemy) {
        // Determine which direction the orc is facing based on current animation
        const currentAnim = enemy.anims.currentAnim?.key;
        if (currentAnim?.includes('_right')) return 'right';
        if (currentAnim?.includes('_left')) return 'left';
        if (currentAnim?.includes('_up')) return 'up';
        if (currentAnim?.includes('_down')) return 'down';
        return enemy.currentDirection; // fallback
    }

    getDirectionFromAngle(angle) {
        // Convert angle to direction
        const degrees = Phaser.Math.RadToDeg(angle);
        if (degrees >= -45 && degrees <= 45) return 'right';
        if (degrees >= 45 && degrees <= 135) return 'down';
        if (degrees >= 135 || degrees <= -135) return 'left';
        if (degrees >= -135 && degrees <= -45) return 'up';
        return 'right';
    }

    isPlayerBehindEnemy(enemyFacing, playerDirection) {
        // Player can attack safely from behind or sides
        const oppositeDirections = {
            'right': 'left',
            'left': 'right',
            'up': 'down',
            'down': 'up'
        };
        
        // Safe if attacking from behind
        if (oppositeDirections[enemyFacing] === playerDirection) return true;
        
        // Safe if attacking from sides (not directly in front)
        if (enemyFacing === 'right' || enemyFacing === 'left') {
            return playerDirection === 'up' || playerDirection === 'down';
        }
        if (enemyFacing === 'up' || enemyFacing === 'down') {
            return playerDirection === 'left' || playerDirection === 'right';
        }
        
        return false;
    }

    damageOrc(enemy) {
        // Reduce orc health
        enemy.currentHealth--;
        enemy.isHurt = true;

        // Stop orc movement
        enemy.setVelocity(0);

        // Show damage feedback
        const damageText = this.add.text(enemy.x, enemy.y - 50, '-1', {
            fontSize: '16px',
            fill: '#FF0000',
            fontStyle: 'bold',
            stroke: '#FFFFFF',
            strokeThickness: 2
        });
        damageText.setOrigin(0.5);

        // Animate damage text
        this.tweens.add({
            targets: damageText,
            y: damageText.y - 30,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });

        // Check if orc is dead
        if (enemy.currentHealth <= 0) {
            this.killOrc(enemy);
        } else {
            this.playOrcHurtAnimation(enemy);
        }

        // Add score for hitting orc
        this.score += 5;
        this.scoreText.setText('Score: ' + this.score);
    }

    playOrcHurtAnimation(enemy) {
        // Determine hurt animation based on current direction
        const direction = this.getEnemyFacingDirection(enemy);
        const hurtAnim = `orc_hurt_${direction}`;
        
        // Play hurt animation
        enemy.play(hurtAnim);

        // Flash red for hurt effect
        enemy.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            enemy.clearTint();
        });

        // Return to normal state after hurt animation
        enemy.once(`animationcomplete-${hurtAnim}`, () => {
            enemy.isHurt = false;
            // Resume patrol or idle based on player proximity
            if (enemy.isNearPlayer) {
                enemy.play('orc_idle_anim');
            } else {
                // Resume walking animation based on direction
                if (enemy.patrolDirection === 'horizontal') {
                    enemy.play(enemy.movingPositive ? 'orc_walk_right' : 'orc_walk_left');
                } else {
                    enemy.play(enemy.movingPositive ? 'orc_walk_down' : 'orc_walk_up');
                }
            }
        });
    }

    killOrc(enemy) {
        enemy.isDead = true;
        enemy.setVelocity(0);

        // Determine death animation based on current direction
        const direction = this.getEnemyFacingDirection(enemy);
        const deathAnim = `orc_death_${direction}`;
        
        // Play death animation
        enemy.play(deathAnim);

        // Add bonus score for killing orc
        this.score += 25;
        this.scoreText.setText('Score: ' + this.score);

        // Show death feedback
        const deathText = this.add.text(enemy.x, enemy.y - 60, 'ORC DEFEATED!', {
            fontSize: '14px',
            fill: '#00FF00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        });
        deathText.setOrigin(0.5);

        // Animate death text
        this.tweens.add({
            targets: deathText,
            y: deathText.y - 40,
            alpha: 0,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                deathText.destroy();
            }
        });

        // Remove orc after death animation completes
        enemy.once(`animationcomplete-${deathAnim}`, () => {
            // Fade out the orc
            this.tweens.add({
                targets: enemy,
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    enemy.destroy();
                }
            });
        });
    }

    showAttackWarning(enemy) {
        // Create warning indicator above orc
        const warningText = this.add.text(enemy.x, enemy.y - 60, '⚠️ ATTACK INCOMING!', {
            fontSize: '12px',
            fill: '#FFFF00',
            fontStyle: 'bold',
            stroke: '#FF0000',
            strokeThickness: 2,
            backgroundColor: '#000000',
            padding: { x: 5, y: 2 }
        });
        warningText.setOrigin(0.5);

        // Create pulsing warning circle around orc
        const warningCircle = this.add.graphics();
        warningCircle.lineStyle(3, 0xFF0000, 0.8);
        warningCircle.strokeCircle(enemy.x, enemy.y, 40);

        // Animate warning indicators
        this.tweens.add({
            targets: [warningText, warningCircle],
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            repeat: 4, // Flash 5 times during 1 second warning
            onComplete: () => {
                warningText.destroy();
                warningCircle.destroy();
            }
        });

        // Make orc flash red during warning
        enemy.setTint(0xff6666);
        this.time.delayedCall(enemy.attackPattern.warningTime, () => {
            enemy.clearTint();
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
