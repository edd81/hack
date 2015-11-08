function newGame () {
	var toReturn = {
		global: {
			version: 0.01,
			playerGathering: "",
			buildingsQueue: [],
			start: new Date().getTime(),
			time: 0,
			lastOnline: 0,
			buyAmount: 1,
			housingLocked: 1,
			jobsLocked: 1,
			menu: {
				resources: true,
				housing: false,
				jobs: false,
				melee: true,
				ranged: false,
				cavalry: false,
				machinery: false
			}
		},
		
		//resources
		resources: {
			people: {
				owned: 0,
				locked: 1
			},
			food: {
				owned: 0,
				locked: 0
			},
			wood: {
				owned: 0,
				locked: 1
			},
			ore: {
				owned: 0,
				locked: 1
			},
			clay: {
				owned: 0,
				locked: 1
			}
		},
		
		//jobs
		jobs: {
			Farmer: {
				locked: 1,
				owned: 0,
				tooltip: "",
				cost: {
					food: 5
				},
				increase: "food",
				modifier: 0.2
			},
			Lumberjack: {
				locked: 1,
				owned: 0,
				tooltip: "",
				cost: {
					food: 5
				},
				increase: "wood",
				modifier: 0.2
			},
			Miner: {
				locked: 1,
				owned: 0,
				tooltip: "",
				cost: {
					food: 5
				},
				increase: "ore",
				modifier: 0.1
			},
			Mason: {
				locked: 1,
				owned: 0,
				tooltip: "",
				cost: {
					food: 5
				},
				increase: "clay",
				modifier: 0.1
			}
		},
		
		//housing
		housing: {
			hut: {
				locked: 0,
				owned: 0,
				tooltip: "A little hut for your people. It provides one working place",
				cost: {
					food: 10,
					wood: 10
				},
				workplaces: 1
			},
			cottage: {
				locked: 1,
				owned: 0,
				tooltip: "A little rustic cottage for your hard working peopel. It adds 3 working places.",
				cost: {
					food: 25,
					wood: 25,
					ore: 5
				},
				workplaces: 3
			},
			house: {
				locked: 1,
				owned: 0,
				tooltip: "Your people need a place to rest. A house is exactly what they need! It adds 5 workplaces.",
				cost: {
					food: 50,
					wood: 50,
					ore: 10,
					clay: 10
				},
				workplaces: 5
			},
			manor: {
				locked: 1,
				owned: 0,
				tooltip: "",
				cost: {
					food: 500,
					wood: 500,
					ore: 250,
					clay: 250
				},
				workplaces: 8
			},
			mansion: {
				locked: 1,
				owned: 0,
				tooltip: "",
				cost: {
					food: 1500,
					wood: 1500,
					ore: 1250,
					clay: 1250
				},
				workplaces: 13
			},
			castle: {
				locked: 1,
				owned: 0,
				tooltip: "A big castle for all the people in the kingdom. A castle is exactly what they wish for protection. It adds 21 workplaces",
				cost: {
					food: 5000,
					wood: 5000,
					ore: 2500,
					clay: 2500
				},
				workplaces: 21
			},
		},
		//settings
		settings: {
			speed: 10
		},
		
		//menu
		options: {
			menu: {
				autoSave: {
					enabled: 1,
					description: "Automatically save the game once per minute",
					titles: ["Not Saving", "Auto Saving"],
					onToggle: function () {
						var elem = document.getElementById("saveIndicator");
						if (this.enabled) elem.innerHTML = "<span class='autosaving'>(AutoSaving)</span>";
						else elem.innerHTML = "<span class='notAutosaving'>(Not AutoSaving)</span>";
					}
				},
				standardNotation: {
					enabled: 1,
					description: "Swap between standard and exponential number formatting",
					titles: ["Exponential Formatting", "Standard Formatting"]
				}
			}
		}
	};
	
	return toReturn;
}

var game = newGame();

