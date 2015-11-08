function autoSave() {
    if (game.options.menu.autoSave.enabled) save();
    setTimeout(autoSave, 60000);
}

function save(exportThis) {
	var saveString = JSON.stringify(game);
    var saveGame = JSON.parse(saveString);
    
	//cleanup old save file
	
    saveString = LZString.compressToBase64(JSON.stringify(saveGame));
    if (exportThis) return saveString;
	try{
		localStorage.setItem("idleNations1",saveString);
		if (localStorage.getItem("idleNations1") == saveString){
			message("Game Saved!", "Notices");
		}
		else {
			message("Your game is not saving. Please export the save manually for backup.", "Notices");
		}
	}
	catch(err){ message("Your game is not saving. Please export the save manually for backup.", "Notices"); }

}

function canAffordBuilding(what, take, buildCostString){
	var costString = "";
	var toBuy = game.housing[what];
	if (typeof toBuy === 'undefined') return false;
	
	for (var costItem in toBuy.cost) {
		var color = "green";
		var price = 0;
		price = parseFloat(getHousingItemPrice(toBuy, costItem));
		
		if (price > game.resources[costItem].owned || !(isFinite(price))) {
			if (buildCostString) color = "red";
			else return false;
		}
		
		costString += '<span class="' + color + '">' + costItem + ':&nbsp;' + prettify(price) + '</span>, ';
		
		if (take) game.resources[costItem].owned -= price;
	}
	
	
	
	if (buildCostString) {
		costString = costString.slice(0, -2);
		return costString;
	}
	
	return true;
	
}

function getHousingItemPrice(toBuy, costItem){
	var price = 0;
	var thisCost = toBuy.cost[costItem];
	
	price = thisCost * game.global.buyAmount;
	
	return price;
}

function load(saveString, autoLoad) {
    var savegame;
	if (saveString) {
		console.log("load from textarea");
		//import text area
        savegame = JSON.parse(LZString.decompressFromBase64(document.getElementById("importBox").value.replace(/(\r\n|\n|\r|\s)/gm,"")));
        tooltip('hide');
		if (!savegame) {
			message("It looks like your import code isn't working properly. Please make sure that your export code is saved in a text file compatible with all of the characters. If you believe this code should be working, you can Email it to Trimpsgame@gmail.com and I will do my best to restore it for you!", "Notices");
			return;
		}
    } else if (localStorage.getItem("idleNations1") !== null) {
		console.log("load from localstorage");
		//from local storage
        savegame = JSON.parse(LZString.decompressFromBase64(localStorage.getItem("idleNations1")));
		
		
		game = savegame;
    }
    if (typeof savegame === 'undefined' || savegame === null || typeof savegame.global === 'undefined') {
		console.log("loading - it's a new game");
		//new game
		tooltip("Welcome", null, "update");
		return;
	}
	
	updateLabels();
	
}



function resetGame() {
	game = null;
	game = newGame();
	game.global.autoSave = autoSave;
	//game.global.messages = messages;
	//game.options = options;
	updateLabels();
	autoSave();
}



function clickGather(what) {
	var res = game.resources[what];
	res.owned +=1;
}

function clickJob(what) {
	var job = game.jobs[what];
	
	//see if there are enough workplaces available
	var totalWorkplaces = 0;
	for (var item in game.housing){
		toUpdate = game.housing[item];
		totalWorkplaces += toUpdate.owned * toUpdate.workplaces;
	}
	
	var ocupiedWorkplaces = 0;
	for (var item in game.jobs){
		toUpdate = game.jobs[item];
		ocupiedWorkplaces += toUpdate.owned;
	}
	
	var jobsAvailable = totalWorkplaces - ocupiedWorkplaces;
	
	if (jobsAvailable >0){
		job.owned +=1;
	}
}

function buyHousing(what) {
	var buildingInfo = game.housing[what.toLowerCase()];
	if (canAffordBuilding(what.toLowerCase(), true)) {
		buildingInfo.owned += game.global.buyAmount;
	};
	
	
}

function gameLoop() {
	//increase resources based on jobs
	for (var item in game.jobs){
		var toUpdate = game.jobs[item];
		var resToIncrease = toUpdate.increase;
		var amt = toUpdate.owned * toUpdate.modifier;
		
		game.resources[resToIncrease].owned += amt;
	}
	
	
	unlockStuff();	
	updateLabels();
	setTimeout(gameLoop, (1000 / game.settings.speed));
}

function unlockStuff(){
	//unlock woodTr
	if (game.resources.food.owned >= 10 && game.resources.wood.locked == 1){
		fadeIn("woodTr", 10);
		game.resources.wood.locked = 0;
		writeStory('Your people have discovered how to cut wood. It\'s surely going to help us out! Click <span class="blue">gather</span> 10 times.');
	}
	
	//unlock housing
	if (game.resources.food.owned >= 10 && game.resources.wood.owned >= 10 &&  game.global.housingLocked == 1){
		fadeIn("housingTab", 10);
		 game.global.housingLocked = 0;
		 writeStory('Now that you have some resources, let\'s build a hut to house your workers.');
	}
	
	//unlock jobs
	if (game.housing.hut.owned >= 1 && game.global.jobsLocked == 1){
		fadeIn("jobsTab", 10);
		 game.global.jobsLocked = 0;
		 writeStory('The workers will gather resources for you automatically. Go check out the Jobs available and hire a Farmer or a Lumberjack.');
	}
}

function saveFromClick(){
	autoSave();
}

function newGameClick() {
	resetGame();
}

function fadeIn(elem, speed) {
	console.log("doing fade");
    var opacity = 0;
    elem = document.getElementById(elem);
    var fadeInt = setInterval(function () {
        opacity = opacity + 0.01;
        elem.style.opacity = opacity;
        if (opacity >= 1) {
            clearInterval(fadeInt);
        }
    }, speed);
}





load();
setTimeout(autoSave, 10000);
setTimeout(gameLoop, (1000 / game.settings.speed));

