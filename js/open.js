

window.addEventListener('load', init);
function init() {
  // サイズを指定
  const width = 1400;
  const height = 400;
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  // シーンを作成
  const scene = new THREE.Scene();
  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1000);
  // 箱を作成
  const geometry = new THREE.BoxGeometry(600, 600, 600);
  // const geometry = new THREE.BoxGeometry(400, 400, 400);
  // マテリアルにテクスチャーを設定
  const material = new THREE.MeshNormalMaterial();
  // const material = new THREE.MeshBasicMaterial({ color: '#124dae' });  //素材を変えることができる
  const box = new THREE.Mesh(geometry, material);
  scene.add(box);
  animate();
  // 毎フレーム時に実行されるイベント
  function animate() {
    //箱を回転させる
    //ここの数値を変えると回転速度が変わる
    box.rotation.x += 0.005;
    box.rotation.y += 0.006;
    renderer.render(scene, camera); // レンダリング
    requestAnimationFrame(animate);
  }
}