import { createLetters } from "./letters";
import { createScene } from "./scene";

const { scene, camera, renderer } = createScene();

async function init() {
	await createLetters(scene);
	animate();
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

init();
