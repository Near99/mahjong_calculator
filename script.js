const storeData = {
  scoresStorage: window.localStorage,

  setData() {
    this.scoresStorage.setItem("scores", JSON.stringify(game.playerInfo));
  },

  getData() {
    if (!JSON.parse(this.scoresStorage.getItem("scores"))) {
      return;
    } else {
      game.playerInfo = JSON.parse(this.scoresStorage.getItem("scores"));
    }
  },

  removeData() {
    if (JSON.parse(this.scoresStorage.getItem("scores"))) {
      this.scoresStorage.removeItem("scores");
    }
  },
};

const game = {
  roundCounter: 0,
  playerInfo: [
    {
      id: "p1",
      name: "kaixing",
      score: 0,
      win: 0,
      winRate: 0,
      self: 0,
      disCardGiven: 0,
    },
    {
      id: "p2",
      name: "wenwen",
      score: 0,
      win: 0,
      winRate: 0,
      self: 0,
      disCardGiven: 0,
    },
    {
      id: "p3",
      name: "yuhao",
      score: 0,
      win: 0,
      winRate: 0,
      self: 0,
      disCardGiven: 0,
    },
    {
      id: "p4",
      name: "manman",
      score: 0,
      win: 0,
      winRate: 0,
      self: 0,
      disCardGiven: 0,
    },
  ],

  errorChecking() {
    const res = this.playerInfo.reduce((accu, player) => {
      return accu + player.score;
    }, 0);
    if (res) {
      console.log("error");
    } else {
      console.log("no error found");
    }
  },

  sorting() {
    // update round
    this.roundCounter++;
    // sorting
    this.playerInfo.sort((a, b) => (a.score > b.score ? -1 : 1));
    // compute win rate
    this.playerInfo.forEach((player) => {
      player.winRate = Math.floor((player.win / this.roundCounter) * 100);
    });
    this.errorChecking();
    storeData.setData();
  },

  selfDraw(winner, fan) {
    this.playerInfo.forEach((player) => {
      if (player.id === winner) {
        player.score += (fan + 8) * 3;
        player.win++;
        player.self++;
      } else {
        player.score -= fan + 8;
      }
    });
    this.sorting();
  },

  fromDiscard(winner, loser, fan) {
    this.playerInfo.forEach((player) => {
      if (player.id === winner) {
        player.score += fan + 3 * 8;
        player.win++;
      }
      if (player.id === loser) {
        player.score -= fan + 8;
        player.disCardGiven++;
      }
      if (player.id !== winner && player.id !== loser) {
        player.score -= 8;
      }
    });
    this.sorting();
  },

  computeScore(winner, loser, fan, isSelfDraw = false) {
    if (isSelfDraw) {
      this.selfDraw(winner, fan);
    } else {
      this.fromDiscard(winner, loser, fan);
    }
  },
};

const display = {
  playerContainer: document.querySelectorAll("[data-player]"),
  renderData() {
    game.playerInfo.forEach((player, index) => {
      this.playerContainer[index].innerHTML = `
      Name: ${player.name} 
      Score: ${player.score} 
      Win: ${player.win} 
      Self Draw: ${player.self} 
      Discard Given: ${player.disCardGiven}`;
    });
  },
};

window.addEventListener("DOMContentLoaded", () => {
  storeData.getData();
  console.table(game.playerInfo);
  display.renderData();
});

const winBut = document.querySelector(".winBut");
const clearBut = document.querySelector(".clearData");

winBut.addEventListener("click", () => {
  game.computeScore("p2", undefined, 29, true);
  display.renderData();
});

clearBut.addEventListener("click", () => {
  storeData.removeData();
});

winBut.addEventListener("touchstart", () => {
  game.computeScore("p2", undefined, 29, true);
  display.renderData();
});

clearBut.addEventListener("touchstart", () => {
  storeData.removeData();
});
