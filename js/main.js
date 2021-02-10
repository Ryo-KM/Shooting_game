

// 敵クラスを作成
class Enemy {
	constructor(x, y, angle, kind) {
		this.kind = kind; // 敵の種類
		this.BULLET_NUM = 3; // 敵の最大弾数
		this.bullet = Array(this.BULLET_NUM); // 弾の変数
		for(var i = 0;i < 5;i++) {
			this.bullet[i] = new Bullet();
		}
		this.x = x; // X座標
		this.y = y; // Y座標
		this.width = 32; // 幅
		this.height = 32; // 高さ
		this.angle = angle; // 角度
		this.spd = 3; // 速度
		this.cnt = 0; // カウンタ(ループした回数だけ加算されていく)
  }

  getBulletNum() { // 発射されていない弾を検索
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(!this.bullet[i].exist) {
				return i;
			}
		}
		return -1;
	}
	
	shot() {
		if(this.cnt % 20 == 0) { // 20カウントずつ発射
			var num = this.getBulletNum(); // 発射されてない弾の番号を取得
			if(num != -1) {
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 4, 4, this.angle, 5);
			}
		}
		//	発射された弾を更新
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {
				this.bullet[i].move(); // 弾が発射されていれば動かす
			}
		}
		//	カウンタを更新
		this.cnt++;
	}
  
  move() {
		//	X・Y座標を更新。進行方向
		this.x += Math.cos(this.angle) * this.spd;
		this.y += Math.sin(this.angle) * this.spd;
		
		//	壁に当たったら跳ね返る様に、this.angleを計算すr
		if(this.x < this.width / 2 || this.x > WIDTH - this.width / 2) {
			this.angle = Math.PI - this.angle;
			this.spd *= 1.05; // 壁に当たる毎に徐々に速くなる
		}
		else if(this.y < this.height / 2 || this.y > HEIGHT - this.height / 2) {
			this.angle = Math.PI * 2 - this.angle;
			this.spd *= 1.05; // 壁に当たる毎に徐々に速くなる
		}
  }
  
  draw(context) {
		//	敵を描画
		switch(this.kind) {
      // 種類の値によって描く敵の色を変える
			case 0: context.fillStyle = "rgb(0, 255, 255)"; break; // 水色
			case 1: context.fillStyle = "rgb(0, 255, 0)"; break; // 緑色
			case 2: context.fillStyle = "rgb(255, 255, 255)"; break; // 白色
		}
    context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    
    //	敵の弾を描画
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) {
				this.bullet[i].draw(context);
			}
		}
	}
}

// 弾クラスを作成
class Bullet {
  // 弾に必要な変数を定義
  constructor(){
    this.exist = false;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.angle = 0;
    this.spd = 0;
  }

  enter(x, y, width, height, angle, spd){
    this.exist = true;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.spd = spd;
  }

  move() {
		//	X・Y座標を更新
		this.x += Math.cos(this.angle) * this.spd;
		this.y += Math.sin(this.angle) * this.spd;
		
		//	画面外に出たら消す
		if(this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT) {
      this.exist = false;
      // 画面の外に出てfalseになるので連続で撃つ場合、最初の1発目が外に出までに5発を打ち終わると、弾切れ状態になる。
    }
  }
  
  draw(context) {
		//	弾を描画
		context.fillStyle = "rgb(255, 255, 0)";
		context.fillRect(this.x - (this.width / 2), this.y - (this.height / 2), this.width, this.height);
	}
}


// プレイヤークラスを作成
class Player {
  constructor(){
    // プレイヤーに必要な変数を定義
    this.cnt = 0; // ループした回数だけ加算されていくカウンタ。
    this.residue = 3;
    this.deffect = false; // ダメージエフェクトのフラグ
    this.x = WIDTH / 2;
    this.y = HEIGHT * 3 / 4;
    this.width = 24;
    this.height = 36;

    // 弾に関する初期設定
    this.BULLET_NUM = 5; //便宜上5発としているが、5発しか撃てないわけではない
    this.bullet = Array(this.BULLET_NUM);
    for(var i=0; i < this.BULLET_NUM; i++){
      this.bullet[i] = new Bullet(); // 弾の数だけBulletインスタンスを作成
		}
		
		this.SPE_NUM = 12; // 必殺技は12発の弾を周りに放つ。
		this.spe_bullet = Array(this.SPE_NUM);
		for(var i=0; i < this.SPE_NUM; i++){
      this.spe_bullet[i] = new Bullet(); // 弾の数だけBulletインスタンスを作成
		}
  }

  draw(context){
    // プレイヤーを描画
		// ダメージエフェクトで1カウントずつ交互に表示・非表示を切り替える
		// this.deffect=true と this.cnt % 2 == 0 が同時に成立していない時に描く。
		if(!(this.deffect && this.cnt % 2 == 0)) {
			if(Invisible != 1){
				context.fillStyle = "rgb(255, 0, 0)";
				context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
			}
			if(Invisible == 1){
				context.fillStyle = "rgb(218, 179, 0)";
				context.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
			}
		}

    for(var i = 0;i < this.BULLET_NUM;i++) {
			if(this.bullet[i].exist) { // shot関数でexist=trueとなった弾を描く
				this.bullet[i].move();
				this.bullet[i].draw(context);
			}
		}
		
		for(var i = 0; i<this.SPE_NUM; i++){
			if(this.spe_bullet[i].exist){
				this.spe_bullet[i].move();
				this.spe_bullet[i].draw(context);
			}
		}
    
    // カウンタが100になったらリセットし、ダメージエフェクトを解除
		if(this.cnt > 100) {
			this.cnt = 0;
			this.deffect = false;
			if(Invisible==1){
				Invisible = 2;
			}
    }
    if(Invisible!=1){
			this.cnt++;
		}
		if(Invisible==1){
			this.cnt = this.cnt + 0.25;
		}
  }

  move(key){
    var diagonal = 1.0;
    var hori = false;
    var vert = false;

    if(key['RIGHT'] != 0 || key['LEFT'] != 0){
      hori = true;
    }
    if(key['UP'] != 0 || key['DOWN'] != 0){
      vert = true;
    }
    if(hori && vert){
      diagonal = Math.sqrt(2.0);
    }
    var mx = this.x + (key['RIGHT'] - key['LEFT']) * 8 / diagonal;
    var my = this.y + (key['DOWN'] - key['UP']) * 8 / diagonal;
    
    if(!(mx < this.width / 2 || mx > WIDTH - this.width / 2)) {
			this.x = mx;
		}
		if(!(my < this.height / 2 || my > HEIGHT - this.height / 2)) {
			this.y = my;
		}
  }

  // 弾に関する関数
  getBulletNum() {	//	発射されていない弾を検索
		for(var i = 0;i < this.BULLET_NUM;i++) {
			if(!this.bullet[i].exist) { // 5つインスタンス化した時点ではexistはfalse
				return i;
			}
		}
		return -1; // 全て発射されている場合は-1を返す
	}
	
	shot(key) {
		var num; // 発射できる弾の番号
		if(key['Z'] == 1) {
			num = this.getBulletNum(); // 弾の番号を取得
			if(num != -1) {
				//	弾を登録
				this.bullet[num].enter(this.x, this.y, 4, 12, -Math.PI / 2, 10);
				//	Zキー状態を更新
				key['Z']++;
			}
		}
		// 必殺技を仕込む
		if(Spe_Bullet == 1){
			for(var i=0; i<this.SPE_NUM; i++){
				this.spe_bullet[i].enter(this.x, this.y, 4, 12, (Math.PI/6) * i, 7)
			}
			Spe_Bullet = 2;
		}
	}
}



// canvas画面の大きさ
let WIDTH = 1000;
let HEIGHT = 700;

// 移動と砲弾のフラグを設定
var key = {'RIGHT':0, 'LEFT':0, 'UP':0, 'DOWN':0, 'Z':0};
var Spe_Bullet = 0;
var Invisible = 0;
var Game_Start = 0;
var roop = 0;

// 自身と敵をインスタンス化
var player = new Player(); // プレイヤークラスのインスタンス
let ENEMY_NUM = 10; // 敵の数
var enemy = Array(ENEMY_NUM); // Enemyクラスのインスタンス（配列）
var kind = [1, 0, 1, 0, 0, 2, 0, 1, 0, 1]; // 敵の種類を設定
//	Enemyのインスタンス化
for(var i = 0;i < ENEMY_NUM;i++) {
	enemy[i] = new Enemy(WIDTH * (i + 1) / 11, HEIGHT / 4, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 10, kind[i]); // 画面を10分割して、そのうち中央の8個に配置
}

var canvas = $('#canvas').get(0);
var context = canvas.getContext('2d');
var score = 0; // スコア
var gameover = false; // ゲームオーバーフラグ
var cnt = 0;

// 最初の画面において、スペースキーを押すとゲームがスタートする
$(window).on('keydown', function(e){
	var code = e.keyCode
	if(code==32 && Game_Start==0){
		context.clearRect(0, 0, WIDTH, HEIGHT);
		requestAnimationFrame(main); // main関数を実行
		Game_Start = 1;
	}
})

if(Game_Start==0) {
	// GAME START と表示する
	context.font = "bold 60px sans-serif";
	context.fillStyle = "rgb(255, 100, 100)";
	context.fillText("GAME START!", WIDTH / 4, HEIGHT / 2.5);
	
	context.font = "bold 40px sans-serif";
	context.fillStyle = "rgb(255, 255, 255)";
	context.fillText("Press SPACE KEY to Start", WIDTH / 5, HEIGHT * 2 / 3);
}

// Xを押すと画面がpauseできる様にする
$(window).on('keydown', function(e){
	var code = e.keyCode
	if(code==88 && roop==0){
		roop = 1;
	}
})
// Sを押すとPAUSEを解除
$(window).on('keydown', function(e){
	var code = e.keyCode
	if(code==83 && roop==1){
		roop = 0;
		requestAnimationFrame(main);
	}
})

// 残機が残り1機の時にctrlキーを押すと5秒間無敵になる。
$(window).on('keydown', function(e){
	var code = e.keyCode
	if(code==17 && player.residue==1 && Invisible==0){
		Invisible = 1;
		player.deffect = true; // ダメージエフェクトを開始する
		player.cnt = 0; // プレイヤーのカウンタをリセット
	}
})


// main関数の中身を1/60秒に1回の速度で実行する
// 書いて消してを繰り返す
function main() {
  context.clearRect(0, 0, WIDTH, HEIGHT); // プレイヤーを消去

  if(!gameover) { // ゲームオーバーでなければ実行する
		player.shot(key); // プレイヤーのショット
		player.move(key); // プレイヤーを操作
		player.draw(context); // プレイヤーを描画
	}
  // ループさせ映画やアニメのように画像を高速でコマ送りのようにする

  for(var i = 0;i < ENEMY_NUM;i++) {
    enemy[i].shot(); // 敵のショット
		enemy[i].move(); // 敵を移動
		enemy[i].draw(context); // 敵を描画
  }
  
  if(!gameover) {
		// 敵とプレイヤーの当たり判定
		// それぞれのX座標とY座標の差の絶対値を取り、それぞれ(横幅の和)/2と(縦幅の和)/2と比較する
		// player.deffect = true であり、その後cntが100に到達するまではこの判定は行わない(無敵になる)
		for(var i = 0;i < ENEMY_NUM;i++) {
			if(!player.deffect && Math.abs(player.x - enemy[i].x) < (player.width + enemy[i].width) / 2 &&
				Math.abs(player.y - enemy[i].y) < (player.height + enemy[i].height) / 2) {
				player.cnt = 0; // プレイヤーのカウンタをリセット
				player.residue--; // プレイヤーの残基を減らす
				player.deffect = true; // ダメージエフェクトを開始する
			}
		}
		
		// プレイヤーと敵の弾の当たり判定
		// 考え方は敵とプレイヤーの時と同じ。敵の弾一つ一つに対して判定を行うので、for文とif文が一つずつ増える。
		for(var i = 0;i < ENEMY_NUM;i++) {
			for(var j = 0;j < enemy[i].BULLET_NUM;j++) {
				if(enemy[i].bullet[j].exist) {
					if(!player.deffect && Math.abs(player.x - enemy[i].bullet[j].x) < (player.width + enemy[i].bullet[j].width) / 2 &&
						Math.abs(player.y - enemy[i].bullet[j].y) < (player.height + enemy[i].bullet[j].height) / 2) {
						player.cnt = 0; // プレイヤーのカウンタをリセット
						player.residue--; // プレイヤーの残基を減らす
						player.deffect = true; // ダメージエフェクトを開始する
					}
				}
			}
		}
		
		// プレイヤーの弾と敵の当たり判定
		// 接触していた場合、その敵の場所・角度をランダムに変える。また衝突した弾を消し、スコアを足す。
		for(var i = 0;i < player.BULLET_NUM;i++) {
			if(player.bullet[i].exist) {
				for(var j = 0;j < ENEMY_NUM;j++) {
					if(Math.abs(player.bullet[i].x - enemy[j].x) < (player.bullet[i].width + enemy[j].width) / 2 &&
						Math.abs(player.bullet[i].y - enemy[j].y) < (player.bullet[i].height + enemy[j].height) / 2) {
						enemy[j].x = WIDTH / 12 + Math.random() * WIDTH * 5 / 6; // ランダムなX座標に設定
						enemy[j].y = HEIGHT / 8; // Y座標を設定
						enemy[j].angle = Math.PI * 2 * Math.random(); // ランダムな角度に設定
						player.bullet[i].exist = false; // プレイヤーの弾を消す
						switch(enemy[j].kind) {
							case 0: score += 100; break; // スコアを100アップ
							case 1: score += 200; break; // スコアを200アップ
							case 2: score += 300; break; // スコアを300アップ
						}
					}
				}
			}
		}

		for(var i = 0;i < player.SPE_NUM;i++) {
			if(player.spe_bullet[i].exist) {
				for(var j = 0;j < ENEMY_NUM;j++) {
					if(Math.abs(player.spe_bullet[i].x - enemy[j].x) < (player.spe_bullet[i].width + enemy[j].width) / 2 &&
						Math.abs(player.spe_bullet[i].y - enemy[j].y) < (player.spe_bullet[i].height + enemy[j].height) / 2) {
						enemy[j].x = WIDTH / 12 + Math.random() * WIDTH * 5 / 6; // ランダムなX座標に設定
						enemy[j].y = HEIGHT / 8; // Y座標を設定
						enemy[j].angle = Math.PI * 2 * Math.random(); // ランダムな角度に設定
						player.spe_bullet[i].exist = false; // プレイヤーの弾を消す
						switch(enemy[j].kind) {
							case 0: score += 100; break; // スコアを100アップ
							case 1: score += 200; break; // スコアを200アップ
							case 2: score += 300; break; // スコアを300アップ
						}
					}
				}
			}
		}

	}
	
	if(player.residue == 0) { // 残基が0になったら
		gameover = true; // ゲームオーバーにする
		
		//	プレイヤーの弾をすべて消す
		for(var i = 0;i < player.BULLET_NUM;i++) {
			player.bullet[i].exist = false;
		}
	}
  
  //	残基の表示
	for(var i = 0;i < player.residue;i++) {
		context.fillStyle = "rgb(255, 0, 0)";
		context.fillRect(10 + i * 40, 60, player.width, player.height);
  }
  
  //	スコアの表示
	context.font = "bold 20px sans-serif";
	context.fillStyle = "rgb(255, 255, 255)";
  context.fillText("SCORE: " + score, 10, 40);
  
  //	ゲームオーバー後の内容
	if(gameover) {
		//	GAME OVERと表示する
		context.font = "bold 60px sans-serif";
		context.fillStyle = "rgb(255, 100, 100)";
		context.fillText("GAME OVER...", WIDTH / 4, HEIGHT / 2.5);
		
		//	Press Enter to Continueと表示する
		context.font = "bold 40px sans-serif";
		context.fillStyle = "rgba(255, 255, 255, " + (Math.sin(Math.PI * 2 * cnt / 200)) + ")";
		context.fillText("Press Enter to Continue", WIDTH / 5, HEIGHT * 2 / 3);
		
		//	カウンタを更新
		cnt++;
		//	カウンタを200でリセットする
		if(cnt == 200) cnt = 0;	
	}

	if(roop == 0){
		requestAnimationFrame(main); // ループ
	}
}

$(window).on('keydown', function(e){
  var keyCode = e.keyCode;
  if(keyCode==39){
    key['RIGHT'] = 1;
  }else if(keyCode==37){
    key['LEFT'] = 1;
  }else if(keyCode==38){
    key['UP'] = 1;
  }else if(keyCode==40){
    key['DOWN'] = 1;
  }else if(keyCode==90){
		key['Z'] = 1;
		$(window).on('keydown', function(e){
			var keycode = e.keyCode;
			if(keycode==16 && Spe_Bullet==0){
				Spe_Bullet = 1;
				console.log(Spe_Bullet);
			}
		})
  }else if(keyCode==13){
  //	ゲームオーバー後にEnterが押されたら
		if(gameover) {
			gameover = false; // ゲームオーバーを解除
			player.residue = 3; // 残基をリセット
			player.deffect = false; // ダメージエフェクトを解除
			player.x = WIDTH / 2; // X座標をリセット
			player.y = HEIGHT * 3 / 4; // Y座標をリセット
			score = 0; // スコアをリセット
			Spe_Bullet = 0;
			Invisible = 0;
				
			//	敵を初期化
			for(var i = 0;i < ENEMY_NUM;i++) {
				enemy[i] = new Enemy(WIDTH * (i + 1) / 11, HEIGHT / 4, Math.PI * 5 / 6 - Math.PI * 2 / 3 * i / 7, kind[i]);
			}
		}
  }
})

$(window).on('keyup', function(e){
  var keyCode = e.keyCode;
  if(keyCode==39){
    key['RIGHT'] = 0;
  }else if(keyCode==37){
    key['LEFT'] = 0;
  }else if(keyCode==38){
    key['UP'] = 0;
  }else if(keyCode==40){
    key['DOWN'] = 0;
  }else if(keyCode==90){
    key['Z'] = 0;
  }
})

