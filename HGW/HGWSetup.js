import { getServersSortedByProfit, isMinSecurity, hasMaxMoney, getMostProfitableServer, getAllAvailableThreads, coexec, updatePortData, getPortData, logServerStatus } from '../lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	let target = getMostProfitableServer(ns);
	ns.tail();

	
	// new
	let threadsLeft = getAllAvailableThreads(ns);
	let targets = getServersSortedByProfit(ns);
	while (threadsLeft >= hgwThreads(ns, target, 1)) {
		break;
	}
	// new
	await updatePortData(ns, 20, 'status', 'openports');
	if(!isMinSecurity(ns, target)){
		await minimizeSecurity(ns, target);
	}else if(!hasMaxMoney(ns, target)){
		await maximizeMoney(ns, target);
	}else{
		await prepareHGWThreads(ns, target);
		await updatePortData(ns, 20, 'status', 'hgw');
	}
	
}



/** @param {NS} ns 
 * 	@param {String} target
 * **/
async function minimizeSecurity(ns, target) {
		let threads = getAllAvailableThreads(ns, 1.75);
		let threadsNeeded = Math.ceil((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / ns.weakenAnalyze(1));
		if (threadsNeeded < threads) threads = threadsNeeded;
		coexec(ns, 'Weaken.js', threads, 1.75, '--target', target);
		await ns.sleep(ns.getWeakenTime(target) + 200);
}

/** @param {NS} ns 
 * 	@param {String} target
 * **/
async function maximizeMoney(ns, target) {
	let maxThreads = getAllAvailableThreads(ns, 1.75);
	let ratioGW = ns.weakenAnalyze(1) / ns.growthAnalyzeSecurity(1);
	let threadsGrow = maxThreads / (ratioGW + 1) | 0;
	let threadsWeaken = Math.ceil(threadsGrow / ratioGW);

		let growTime = ns.getGrowTime(target);
		let weakenTime = ns.getWeakenTime(target);
		let delta = weakenTime - growTime - 200;
		let threadsNeeded = Math.ceil(ns.growthAnalyze(target, ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target)));
		if (threadsNeeded < threadsGrow) {
			threadsGrow = threadsNeeded;
			threadsWeaken = weakenThreads(ns, 0, threadsGrow);
		}
		coexec(ns, 'Weaken.js', threadsWeaken, 1.75, '--target', target);
		coexec(ns, 'Grow.js', threadsGrow, 1.75, '--target', target, '--delay', delta);
		await ns.sleep(growTime + 400);
}


/** @param {NS} ns 
 * 	@param {String} target
 * **/
async function prepareHGWThreads(ns, target) {
	let hthreads = 1 / ns.hackAnalyze(target) | 0;
	let maxThreads = getAllAvailableThreads(ns, 1.75);

	while (hthreads * ns.hackAnalyze(target) == 1
		|| hgwThreads(ns, target, hthreads) > maxThreads) {
		hthreads--;
	}

	await updatePortData(ns, 20, 'hgw', {
		'target': target,
		'hack': {
			'time': ns.getHackTime(target),
			'threads': hthreads
		},
		'grow': {
			'time': ns.getGrowTime(target),
			'threads': growThreads(ns, target, hthreads)
		},
		'weaken': {
			'time': ns.getWeakenTime(target),
			'threads': weakenThreads(ns, hthreads, growThreads(ns, target, hthreads))
		}
	});
	return hgwThreads(ns, target, hthreads);
}


/** @param {NS} ns 
 * 	@param {String} target
 * 	@param {Number} hackThreads
 * **/
function growThreads(ns, target, hackThreads) {
	return Math.ceil(ns.growthAnalyze(target, 1 / (1 - ns.hackAnalyze(target) * hackThreads)));
}

/** @param {NS} ns 
 * 	@param {Number} hackThreads
 * 	@param {Number} growThreads
 * **/
function weakenThreads(ns, hackThreads, growThreads) {
	return Math.ceil((ns.hackAnalyzeSecurity(hackThreads) + ns.growthAnalyzeSecurity(growThreads)) / ns.weakenAnalyze(1));
}

/** @param {NS} ns 
 * 	@param {String} target
 * 	@param {Number} hackThreads
 * **/
function hgwThreads(ns, target, hackThreads) {
	let h = hackThreads;
	let g = growThreads(ns, target, h);
	let w = weakenThreads(ns, h, g);
	return h + g + w;
}

async function minimizeSecurity2(ns, targets) {

}

/** @param {NS} ns 
 * 	@param {String} target
 * 	@param {Number} maxThreads
 * **/
function hgwBatch(ns, target, maxThreads) {
	let hthreads = 1 / ns.hackAnalyze(target) | 0;

	while (hthreads * ns.hackAnalyze(target) == 1
		|| hgwThreads(ns, target, hthreads) > maxThreads) {
		hthreads--;
	}

	let h = hthreads;
	let g = growThreads(ns, target, h);
	let w = weakenThreads(ns, h, g);

	return {
		'hack': {
			'threads': h,
			'time': ns.getHackTime(target)
		},
		'grow': {
			'threads': g,
			'time': ns.getGrowTime(target)
		},
		'weaken': {
			'threads': w,
			'time': ns.getWeakenTime(target)
		},
		get threads(){
			return this.hack.threads + this.grow.threads + this.weaken.threads; 
		}
	};
}


function batches(ns) {
	let threads = getAllAvailableThreads(ns);

}