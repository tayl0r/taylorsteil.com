const TWO_PI = Math.PI * 2;
const PERIOD = 10; // seconds

interface Offset {
	x: number;
	y: number;
	z: number;
}

type MotionFn = (t: number) => Offset;

// T — sine wave: bobs up and down on Y-axis
function sineWave(t: number): Offset {
	return { x: 0, y: Math.sin(t) * 0.8, z: 0 };
}

// A — circular orbit in XY plane
function circularOrbit(t: number): Offset {
	return { x: Math.cos(t) * 0.6, y: Math.sin(t) * 0.6, z: 0 };
}

// Y — parabolic arc: rises and falls on Y, slight X drift
// Uses a shifted cosine so it starts and ends at 0
function parabolicArc(t: number): Offset {
	// -cos(t) goes from -1 to 1 to -1; shift to 0..1..0
	const y = (1 - Math.cos(t)) / 2;
	return { x: 0, y: y * 1.2, z: 0 };
}

// L — figure-8 / lemniscate in XZ plane
function figure8(t: number): Offset {
	return {
		x: Math.sin(t) * 0.7,
		y: 0,
		z: Math.sin(t * 2) * 0.4,
	};
}

// O — elliptical orbit in YZ plane
function ellipticalOrbit(t: number): Offset {
	return {
		x: 0,
		y: Math.sin(t) * 0.5,
		z: Math.cos(t) * 0.8,
	};
}

// R — pendulum swing in XY plane
function pendulumSwing(t: number): Offset {
	return {
		x: Math.sin(t) * 0.7,
		y: (1 - Math.cos(t)) * 0.3,
		z: 0,
	};
}

const MOTION_FUNCTIONS: MotionFn[] = [
	sineWave, // T
	circularOrbit, // A
	parabolicArc, // Y
	figure8, // L
	ellipticalOrbit, // O
	pendulumSwing, // R
];

/**
 * Compute the position offset for a given letter index at a given time (seconds).
 * All motions are periodic with a 10-second cycle.
 */
export function getLetterOffset(letterIndex: number, timeSec: number): Offset {
	const normalizedTime = ((timeSec % PERIOD) / PERIOD) * TWO_PI;
	return MOTION_FUNCTIONS[letterIndex](normalizedTime);
}
