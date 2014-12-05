function Character(unique_id, nickname, x, y, heroImgPos) {

	var heroImageData = [
		{
			'sprite_initial': 0,
			'walk_down': [0,1,2],
			'walk_left': [12,13,14],
			'walk_right': [24,25,26],
			'walk_up': [36,37,38]
		},
		{
			'sprite_initial': 3,
			'walk_down': [3,4,5],
			'walk_left': [15,16,17],
			'walk_right': [27,28,29],
			'walk_up': [39,40,41]
		},
		{
			'sprite_initial': 6,
			'walk_down': [6,7,8],
			'walk_left': [18,19,20],
			'walk_right': [30,31,32],
			'walk_up': [42,43,44]
		},
		{
			'sprite_initial': 9,
			'walk_down': [9,10,11],
			'walk_left': [21,22,23],
			'walk_right': [33,34,35],
			'walk_up': [45,46,47]
		}
	];

	this.unique_id = unique_id;
	this.nickname = nickname;
	this.x = 0;
	this.y = 0;
	this.heroImgPos = heroImgPos;


	Character.prototype.getRandomHeroImage = function() {
		var random = Math.floor((Math.random() * (heroImageData.length)) + 0);
		return heroImageData[random];
	}


}

module.exports = Character;
