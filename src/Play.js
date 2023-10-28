class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)


        // add ball
        this.ball = this.physics.add.sprite(width/2, height- height/10, 'ball')

        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.setDamping(true).setDrag(0.5)

        this.wallA = this.physics.add.sprite(0, height/4, 'wall')
        this.wallA.setX(Phaser.Math.Between(0 + this.wallA.width/2, width - this.wallA.width/2))
        this.wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height/2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        //this.walls = this.add.group([this.wallA, wallB])

        this.oneWay = this.physics.add.sprite(0, height/4 * 3, 'oneway')

        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.input.on('pointerdown', (pointer) => {
            let shotDirection
            let shotDirectionX
            pointer.x <= this.ball.x ? shotDirectionX = 1 : shotDirectionX = -1
            pointer.y <= this.ball.y ? shotDirection = 1 : shotDirection = -1
            //changed range to make more accurate
            this.ball.body.setVelocityX(Phaser.Math.Between(200, 400)*shotDirectionX)   
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })


        //goes back on hole in

        this.left = false
        this.right = true

        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
        
         //restart scene when ball hits hole
         this.physics.add.collider(this.ball, this.cup, (scored) => {
            scored.destroy()
            this.scene.start("playScene")

        })

    }

    update() {

        //move bar side to side

        if (this.right){
            this.wallA.x -= 3
            if ((this.wallA.x - this.wallA.width/2) <= 0){
                this.right = false
                this.left = true
            }
        }
        else{
            this.wallA.x += 5
            if ((this.wallA.x + this.wallA.width/2) >= width){
                this.right = true
                this.left = false
            }
        }


    }
}