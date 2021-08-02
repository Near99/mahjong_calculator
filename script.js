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
  playerRanking: document.querySelector(".ranking"),
  renderData() {
    const uls = game.playerInfo
      .map((player, index) => {
        return `
      <li>
      <span class="indexBar">${index + 1}st</span>
      <span>${player.name}</span>
      <span>${player.score}</span>
      </li>
      `;
      })
      .join("");
    this.playerRanking.innerHTML = uls;
  },
};

const winDeclaration = () => {
  const winForm = document.querySelector(".win");

  winForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const self = Object.values(winForm)[0].checked;
    const discard = Object.values(winForm)[1].checked;
    const winner = Object.values(winForm)[2].value;
    const loser = Object.values(winForm)[3].value;
    const fan = Number(Object.values(winForm)[4].value);
    if (self === discard) return;
    if (winner === loser) return;
    if (self) {
      game.computeScore(winner, undefined, fan, self);
    }
    if (discard) {
      game.computeScore(winner, loser, fan, discard);
    }
    display.renderData();
  });
};

const reset = () => {
  const resetBut = document.querySelector(".reset");
  resetBut.addEventListener("touchstart", () => {
    storeData.removeData();
  });
};

window.addEventListener("DOMContentLoaded", () => {
  storeData.getData();
  display.renderData();
  winDeclaration();
  reset();
});
