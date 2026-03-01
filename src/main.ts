import { createScene } from "./scene";

const { scene, camera, renderer } = createScene();

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
