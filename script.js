const storeData = {
  scoresStorage: window.localStorage,

  setData() {
    this.scoresStorage.setItem("scores", JSON.stringify(game.playerInfo));
    this.scoresStorage.setItem("roundCounter", game.roundCounter);
  },

  getData() {
    if (!JSON.parse(this.scoresStorage.getItem("scores"))) {
      return;
    } else {
      game.playerInfo = JSON.parse(this.scoresStorage.getItem("scores"));
    }

    if (!this.scoresStorage.getItem("roundCounter")) {
      return;
    } else {
      game.roundCounter = Number(this.scoresStorage.getItem("roundCounter"));
    }
  },

  removeData() {
    if (JSON.parse(this.scoresStorage.getItem("scores"))) {
      this.scoresStorage.removeItem("scores");
    }

    if (this.scoresStorage.getItem("roundCounter")) {
      this.scoresStorage.removeItem("roundCounter");
    }
  },
};

const game = {
  // used for calculating win rate and displaying game round of course
  roundCounter: 0,
  /**
   * initialize player infos
   *
   * id: unique identifier
   * name: player name
   * win: total winning times
   * winRate: win rate
   * self: number of times for self draw win
   * disCardGiven: number of times for given a discard win
   **/
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
      name: "zhanzhan",
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

  // Throw error if all four players score added not equal to zero.
  errorChecking() {
    const res = this.playerInfo.reduce((accu, player) => {
      return accu + player.score;
    }, 0);
    if (res) {
      alert(`Something went wrong! ${res}`);
      return false;
    } else {
      console.log("no error found");
      return true;
    }
  },

  // sort playerInfo array in descending order, compute win rates and call errorChecking function
  sorting() {
    // update round
    this.roundCounter++;
    // sorting
    this.playerInfo.sort((a, b) => b.score - a.score);
    // compute win rate
    this.playerInfo.forEach((player) => {
      player.winRate = Math.floor((player.win / this.roundCounter) * 100);
    });
    // if no error occurs, store data
    // the data will render anyways if error ever occurs, reload the page will render prior stored data
    // it's unlikely to have score computing errors. No extra actions for draw back I think
    if (this.errorChecking()) storeData.setData();
  },

  // calculating for self draw
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

  // calculating for winning from player's discard
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

  // winning method controller
  computeScore(winner, loser, fan, isSelfDraw = false) {
    isSelfDraw
      ? this.selfDraw(winner, fan)
      : this.fromDiscard(winner, loser, fan);
  },
};

// render data to screen
const display = {
  playerRanking: document.querySelector(".ranking"),
  tableBody: document.querySelector(".tableBody"),

  renderData() {
    const uls = game.playerInfo
      .map((player, index) => {
        return `
       <li>
        <span class="indexBar rank${index}" >${index + 1}st</span>
        <span>${player.name}</span>
        <span>${player.score}</span>
       </li>
      `;
      })
      .join("");
    const tables = game.playerInfo
      .map((player) => {
        return `
        <tr>
          <td>${player.name}</td>
          <td>${player.win}</td>
          <td>${player.winRate}%</td>
          <td>${player.self}</td>
          <td>${player.disCardGiven}</td>
        </tr>
      `;
      })
      .join("");
    this.playerRanking.innerHTML = uls;
    this.tableBody.innerHTML = tables;
  },
};

const winDeclaration = (() => {
  const winForm = document.querySelector(".win");

  winForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // get all values from win submit form
    const self = Object.values(winForm)[0].checked;
    const discard = Object.values(winForm)[1].checked;
    const winner = Object.values(winForm)[2].value;
    const loser = Object.values(winForm)[3].value;
    const fan = Number(Object.values(winForm)[4].value);
    // not allowed to declare a win if fan is less than 8;
    if (fan < 8) return;
    // prevent both self and from discard are checked at the same time.
    if (self === discard) return;
    // prevent if winner and loser are selected the same, or winner is unselected.
    if (winner === loser || winner === "unselected") return;
    // call computeScore accordingly if passes prior checkings;
    if (self) game.computeScore(winner, undefined, fan, true);
    if (discard) {
      // prevent loser not seleted if win method is from discard
      if (loser === "self") return;
      game.computeScore(winner, loser, fan);
    }
    // reset all values to default to prevent miss toucing
    Object.values(winForm)[0].checked = false;
    Object.values(winForm)[1].checked = false;
    Object.values(winForm)[2].value = "unselected";
    Object.values(winForm)[3].value = "self";
    Object.values(winForm)[4].value = "";
    // update screen
    display.renderData();
  });
})();

const reset = (() => {
  const resetBut = document.querySelector(".reset");
  resetBut.addEventListener("touchstart", () => {
    storeData.removeData();
  });
})();

// load stored data and render to screen when page load
window.addEventListener("DOMContentLoaded", () => {
  storeData.getData();
  display.renderData();
});
