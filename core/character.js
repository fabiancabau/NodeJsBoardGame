function Character(unique_id, char_name, hp, mana, atk, str, def, weapon, shield) {

	this.unique_id = unique_id;
	this.char_name = char_name;
	this.hp = hp;
	this.mana = mana;
	this.atk = atk;
	this.str = str;
	this.def = def;
	this.weapon = weapon;
	this.shield = shield;


	Character.prototype.move = function(direction, qty) {
		console.log('Moving: ' + direction + ':' + qty);
	}

	Character.prototype.attack = function(target) {
		dmg = this.atk * (this.str * this.weapon.dmg);
		final_dmg = dmg - target.def;

		target.hp = target.hp - final_dmg;

		if (target.hp <= 0) {
			return false;
		}
		else {
			return target.hp;
		}
	}
}

module.exports = Character;