function tooltip(what, isItIn, event, textString, attachFunction, numCheck, renameBtn, noHide) {
	var elem = document.getElementById("tooltipPopup");
	var ondisplay = null; // if non-null, called after the tooltip is displayed
	if (what == "hide"){
		elem.style.display = "none";
		tooltipUpdateFunction = "";
		return;
	}
	//if (event != 'update' || isItIn)  return;
	
	if (event != "update"){
		var whatU = what, isItInU = isItIn, eventU = event, textStringU = textString, attachFunctionU = attachFunction, numCheckU = numCheck, renameBtnU = renameBtn, noHideU = noHide;
		var newFunction = function () {
			tooltip(whatU, isItInU, eventU, textStringU, attachFunctionU, numCheckU, renameBtnU, noHideU);
		};
		tooltipUpdateFunction = newFunction;
		var cordx = 0;
		var cordy = 0;
		var e = event || window.event;
		if (e.pageX || e.pageY) {
			cordx = e.pageX;
			cordy = e.pageY;
		} else if (e.clientX || e.clientY) {
			cordx = e.clientX;
			cordy = e.clientY;
			
		}
		
		elem.style.left = (cordx + 20) + "px";
		elem.style.top = (cordy + 20) + "px";
	}
	
	var tooltipText;
	var costText = "";
	var toTip;
	var price;
	var canAfford;
	var percentOfTotal = "";
	
	
	if (isItIn == "housing"){
		var buildingInfo = game.housing[what.toLowerCase()];
		tooltipText = buildingInfo.tooltip;
		costText = canAffordBuilding(what.toLowerCase(), false, true);
		
		/*
		
		if (game.global.buyAmt > 1) {
			if (game.buildings[what].percent){
				tooltipText += " <b>You can only purchase 1 " + what + " at a time.</b>";
				what += " X1";
			}
			else {
				what += " X" + game.global.buyAmt;
			}
		}
		*/
	}
	

	
	document.getElementById("tipTitle").innerHTML = what;
	document.getElementById("tipText").innerHTML = tooltipText;
	document.getElementById("tipCost").innerHTML = costText;
	elem.style.display = "block";
}

function updateLabels() {
	var toUpdate;
	//Resources
	for (var item in game.resources){
		toUpdate = game.resources[item];
		if (!(toUpdate.owned > 0)){
			toUpdate.owned = parseFloat(toUpdate.owned);
			if (!(toUpdate.owned > 0)) toUpdate.owned = 0;
		}
		document.getElementById(item + "Owned").innerHTML = prettify(Math.floor(toUpdate.owned), true);
	}
	
	//Housing
	var totalWorkplaces = 0;
	for (var item in game.housing){
		toUpdate = game.housing[item];
		if (!(toUpdate.owned > 0)){
			toUpdate.owned = parseFloat(toUpdate.owned);
			if (!(toUpdate.owned > 0)) toUpdate.owned = 0;
		}
		document.getElementById(item + "Owned").innerHTML = prettify(Math.floor(toUpdate.owned), true);
		
		//add workplaces
		totalWorkplaces += toUpdate.owned * toUpdate.workplaces;
	}
	
	//Jobs
	var ocupiedWorkplaces = 0;
	for (var item in game.jobs){
		toUpdate = game.jobs[item];
		if (!(toUpdate.owned > 0)){
			toUpdate.owned = parseFloat(toUpdate.owned);
			if (!(toUpdate.owned > 0)) toUpdate.owned = 0;
		}
		
		document.getElementById(item + "Owned").innerHTML = prettify(Math.floor(toUpdate.owned), true);
		
		//update Ps
		var resName = toUpdate.increase;
		document.getElementById(resName + "Ps").innerHTML = prettify(Math.floor(toUpdate.owned * toUpdate.modifier * game.settings.speed), true) + "/s";
		
		//add all ocupied workplaces
		ocupiedWorkplaces += toUpdate.owned;
		
	}
	
	//workplaces
	document.getElementById("totalWorkplaces").innerHTML = (totalWorkplaces - ocupiedWorkplaces) + " workplaces";
	
	
	
}

function message(messageString, type, lootIcon, extraClass) {
	console.log(messageString);
	/*
	var log = document.getElementById("log");
	var needsScroll = ((log.scrollTop + 10) > (log.scrollHeight - log.clientHeight));

	var displayType = (game.global.messages[type]) ? "block" : "none";
	var prefix = "";
	if (lootIcon && lootIcon.charAt(0) == "*") {
		lootIcon = lootIcon.replace("*", "");
		prefix =  "icomoon icon-" 
	}
	else prefix = "glyphicon glyphicon-";
	if (type == "Story") messageString = "<span class='glyphicon glyphicon-star'></span> " + messageString;
	if (type == "Combat") messageString = "<span class='glyphicon glyphicon-flag'></span> " + messageString;
	if (type == "Loot" && lootIcon) messageString = "<span class='" + prefix + lootIcon + "'></span> " + messageString;
	var addId = "";
	if (messageString == "Game Saved!") {
		addId = " id='saveGame'";
		if (document.getElementById('saveGame') !== null){
			log.removeChild(document.getElementById('saveGame'));
		}
	}
	if (type == "Notices"){
		messageString = "<span class='glyphicon glyphicon-off'></span> " + messageString;
	}
	log.innerHTML += "<span" + addId + " class='" + type + "Message message" +  " " + extraClass + "' style='display: " + displayType + "'>" + messageString + "</span>";
	if (needsScroll) log.scrollTop = log.scrollHeight;
	if (type != "Story") trimMessages(type);
	*/
}

function writeStory(text) {
	html = '<div class="row"><div class="col-md-12"><p>' + text + '</p></div></div>';
	$(html).hide().appendTo("#storyPanel").fadeIn(1000);
	$("#storyPanel").scrollTop($('#storyPanel').prop("scrollHeight"));

}

function prettify(number) {
	var numberTmp = number;
	number = Math.round(number * 1000000) / 1000000;
	if (number >= 1000 && number < 10000) return Math.floor(number);
	if(number === 0)
	{
		return prettifySub(0);
	}
	var base = Math.floor(Math.log(number)/Math.log(1000));
	
	if (base <= 0) return prettifySub(number);
	number /= Math.pow(1000, base);
	
	var suffices = [
		'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud',
		'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv',
		'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'
	];
	var suffix;
	if ((base <= suffices.length && base > 0) && game.options.menu.standardNotation.enabled)
	{
		suffix = suffices[base-1];
	}
	else
	{
		var exponent = parseFloat(numberTmp).toExponential(2);
		exponent = exponent.replace('+','<sup>') + '</sup>';
		return exponent;
	}

	return prettifySub(number) + suffix;
}

function prettifySub(number){
	number = number.toString();
	var hasDecimal = number.split('.');
	if (typeof hasDecimal[1] === 'undefined' || hasDecimal[0].length >= 3) return number.substring(0, 3);
	return number.substring(0, 4);	
}