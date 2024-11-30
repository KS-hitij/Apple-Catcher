import './style.css'
import Phaser from 'phaser';
import { Physics } from 'phaser';
const gameCanvas=document.getElementById("gameCanvas");
const gameStartDiv = document.getElementById("gameStartDiv");
const gameEndDiv = document.getElementById("gameEndDiv");
const gameStartbtn = document.getElementById("gameStartbtn");
const gameEndScoreSpan = document.getElementById("gameEndScoreSpan");


const speedDown=300;
const sizes={
  height:500,
  width:500
};
class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed=speedDown+40;
    this.target;
    this.points=0;
    this.textScore;
    this.textTime;
    this.bgMusic;
    this.coinSound;
    this.speedIncreased=false;
  }
  preload(){
    this.load.image("bg","/Assets/bg.png");
    this.load.image("basket","/Assets/basket.png");
    this.load.image("apple","/Assets/apple.png");
    this.load.audio("bgMusic","/Assets/bgMusic.mp3");
    this.load.audio("coinSound","/Assets/coin.mp3");
  }
  create(){

    this.scene.pause("scene-game");

    this.bgMusic=this.sound.add("bgMusic",{
      loop:true
    });
    this.coinSound=this.sound.add("coinSound");
    this.bgMusic.play();
    this.add.image(0,0,"bg").setOrigin(0,0);
    this.player = this.physics.add.image(sizes.width/2 - 50,sizes.height-100,"basket").setOrigin(0,0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.cursor = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);
    this.player.setSize(80,15).setOffset(10,45);
    this.target = this.physics.add.image(this.getRandomX(),0,"apple").setOrigin(0,0);
    this.target.setMaxVelocity(0,speedDown);
    this.physics.add.overlap(this.target,this.player,this.targetHit,null,this);
    this.textScore = this.add.text(sizes.width-120,10,"Score:0",{
      font:"25px Arial",
      fill:"#000000"
    });
    this.textTime = this.add.text(10,10,"Remaining Time: 0",{
      font:"25px Arial",
      fill:"#000000"
    });
  }
  update(){
    const {left,right} = this.cursor;
    if(left.isDown)
    {
      this.player.setVelocityX(-this.playerSpeed);
    }
    else if(right.isDown)
    {
      this.player.setVelocityX(this.playerSpeed);
    }
    else
      this.player.setVelocityX(0);
    if(this.target.y>=sizes.height)
    {
      this.gameOver();
    }
    if (this.points > 0 && this.points % 30 === 0 && !this.speedIncreased) {
      const newSpeed = speedDown + 20 * Math.floor(this.points / 30);

      // Update the apple's max velocity and its current velocity
      this.target.setMaxVelocity(0, newSpeed);
      this.target.setVelocityY(newSpeed);

      // Prevent further updates for the same score
      this.speedIncreased = true;
  } else if (this.points % 30 !== 0) {
      this.speedIncreased = false;
    }
  }

  getRandomX(){
    return Math.floor(Math.random()*475);
  }

  targetHit(){
    this.coinSound.play();
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score:${this.points}`);
  }

  gameOver(){
    if (this.bgMusic.isPlaying) {
      this.bgMusic.stop();
  }
    this.sys.game.destroy(true);
    gameEndScoreSpan.innerText=this.points;
    gameEndDiv.style.display="flex";
    this.target.setVelocityY(speedDown);
    this.target.setMaxVelocity(0,speedDown);
  }
}


/*key component used to define the settings and structure of your game.It specifies parameters 
such as the game size, rendering type, physics engine, scenes, and other essential settings. */
const config = {
  type: Phaser.WEBGL, //Forces WebGL rendering.
  canvas: gameCanvas,
  width: sizes.width,
  height: sizes.height,
  physics:{
    default: "arcade",
    arcade:{
      gravity:{y:speedDown},
      debug:false
    }
  },
  scene: [GameScene]
};

// constructor that creates a new Phaser game instance
const game = new Phaser.Game(config);

gameStartbtn.addEventListener("click",()=>{
  gameStartDiv.style.display="none";
  setTimeout(()=>{
    game.scene.resume("scene-game");
  },250);
})