class Arena {
  constructor(hero, monsters, size = 10) {
    this.hero = hero;
    this.monsters = monsters;
    this.size = size;
    this.message = "";
    this.tiles = []
  }

  /**
   * Calcul the distance between two fighters
   * @param {Object} fighter1
   * @param {Object} fighter2
   * @returns Number
   */
  getDistance(fighter1, fighter2) {
    const dist = Math.sqrt(Math.pow(fighter2.x - fighter1.x, 2) + Math.pow(fighter2.y - fighter1.y, 2)).toFixed(2);
    return dist
  }

  /**
   * Find the tile corresponding to the coordinates
   * @param {*} x Number
   * @param {*} y Number
   * @returns Object Tile
   */
  getTile(x, y) {
    return this.tiles.filter(tile => tile.x === x && tile.y === y)
  }

  /**
   * Calcul from the distance of the fight is posssible
   * @param {Object} attacker
   * @param {Obect} defender
   * @returns Boolean
   */
  isTouchable(attacker, defender) {
    return this.getDistance(attacker, defender) <= attacker.getRange()
  }

  /**
   * Calcul the new coordinates after the move if possible
   * @param {String} direction
   * @returns Object with Number
   */
  move(direction) {
    let y = this.hero.y;
    let x = this.hero.x;
    if (direction === "N") this.hero.y -= 1;
    if (direction === "S") this.hero.y += 1;
    if (direction === "E") this.hero.x -= 1;
    if (direction === "W") this.hero.x += 1;

    const tile = this.getTile(this.hero.x, this.hero.y);

    if (!this.checkOnMap(this.hero.x, this.hero.y)) {
      this.message = "Moving outside the map is not possible";
    } else if (this.CheckNoMonster(this.hero)) {
      this.message = "Position already used, you can t move here";
    } else if (tile[0] && !tile[0].crossable) {
      this.message = "Moving over is not possible";
    } else {
      return { x, y };
    }

    document.getElementById('error').innerHTML = this.message;
    this.hero.x = x;
    this.hero.y = y;
  }

  /**
   * Launch the moving of our Hero
   * @param {String} direction
   * @param {Object} hero
   */
  globalMove(direction, hero) {
    this.move(direction);
  }

  /**
   * Check if the coordinate are on the map
   * @param {Number} x
   * @param {Number} y
   * @returns Boolean
   */
  checkOnMap(x, y) {
    return (x >= 0 && x < this.size) && (y >= 0 && y < this.size)
  }

  /**
   * Check of the presence of e monster on the coordinates
   * @param {Number} x
   * @param {Number} y
   * @returns Boolean
   */
  CheckNoMonster(fighter) {
    return this.monsters.some(monster => monster.isAlive() && (monster.x === fighter.x && monster.y === fighter.y))
  }

  /**
   * Check if monsters are still alive
   * @returns Boolean
   */
  checkBattle() {
    return this.monsters.some(monster => monster.life > 0);
  }

  /**
   * Launch the battle between our hero and a monsters
   * @param {Number} id
   * @returns Boolean
   */
  battle(index) {
    let msg = 'This monster is not touchable, please move first';
    let death = false;

    if (this.isTouchable(this.hero, this.monsters[index])) {
      this.hero.fight(this.monsters[index]);

      if (this.isTouchable(this.monsters[index], this.hero && this.monsters[index].isAlive())) {
        this.monsters[index].fight(this.hero);
      }

      if (!this.monsters[index].isAlive()) {
        death = true;
        msg = `${this.hero.name} won 🗡️  ${this.hero.life} 💙 ${this.monsters[index].name} is dead !!!`;
        this.hero.updateExp(this.monsters[index].experience)
      } else if (!this.hero.isAlive()) {
        death = true;
        msg = `${this.monsters[index].name} won 🗡️, your're dead !!!`
      } else {
        msg = `${this.hero.name} 💙 ${this.hero.life} 🗡️  ${this.monsters[index].name} 💙 ${this.monsters[index].life}`
      }

    }

    if (!this.checkBattle()) {
      msg = `${this.hero.name} won this battle. All monsters are dead. Congratulations`
    }

    document.getElementById("error").innerText = msg;
    return death;
  }
}
