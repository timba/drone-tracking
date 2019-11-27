const rad_factor = Math.PI / 180;

function toRadians(degrees: number): number {
	return degrees * rad_factor;
}

// Distance between two lat/lon coordinates uses Haversine formula
// https://en.wikipedia.org/wiki/Haversine_formula
// https://www.movable-type.co.uk/scripts/latlong.html
export function distance_on_geoid(lat1: number, lon1: number, lat2: number, lon2: number): number {

	// radius of earth in metres
	const R = 6378100;

	// Convert degrees to radians
	let φ1 = toRadians(lat1);
	let φ2 = toRadians(lat2);

	let Δφ = toRadians(lat2-lat1);
	let Δλ = toRadians(lon2-lon1);

	let a = 
		Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);

	let c = 2 * Math.asin(Math.sqrt(a));
		
	//let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	let d = R * c;

	return d;

}

// Calculates time interval in seconds between two date objects
export function getTimeInterval(time1: Date, time2: Date) {
    let intervalMs = Math.abs(time1.getTime() - time2.getTime());
    let intervalS = intervalMs / 1000;
    return intervalS;
}