import { getLetterOffset } from "./animations";
import { createLetters, type LetterMesh } from "./letters";
import { createScene } from "./scene";

const { scene, camera, renderer } = createScene();

let letters: LetterMesh[] = [];

async function init() {
	letters = await createLetters(scene);
	animate();
}

function animate() {
	requestAnimationFrame(animate);

	const timeSec = performance.now() / 1000;

	for (const letter of letters) {
		const offset = getLetterOffset(letter.index, timeSec);
		letter.mesh.position.set(
			letter.homePosition.x + offset.x,
			letter.homePosition.y + offset.y,
			letter.homePosition.z + offset.z,
		);
	}

	renderer.render(scene, camera);
}

init();
