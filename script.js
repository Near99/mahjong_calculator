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
    // Throw error if all four players score added not equal to zero.
    const res = this.playerInfo.reduce((accu, player) => {
      return accu + player.score;
    }, 0);
    if (res) {
      alert(`Something went wrong! ${res}`);
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
    // **incomplete feature
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
    const tabls = game.playerInfo
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
    this.tableBody.innerHTML = tabls;
  },
};

const winDeclaration = () => {
  const winForm = document.querySelector(".win");

  winForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // get all values from win submit form
    const self = Object.values(winForm)[0].checked;
    const discard = Object.values(winForm)[1].checked;
    const winner = Object.values(winForm)[2].value;
    const loser = Object.values(winForm)[3].value;
    const fan = Number(Object.values(winForm)[4].value);
    // prevent both self and from discard are checked at the same time.
    if (self === discard) return;
    // prevent if winner and loser are selected the same.
    if (winner === loser) return;
    if (self) {
      game.computeScore(winner, undefined, fan, true);
    }
    if (discard) {
      // prevent loser not seleted if win method is from discard
      if (loser === "self") return;
      game.computeScore(winner, loser, fan);
    }
    // prevent submit the same result for more than once
    Object.values(winForm)[4].value = "";
    // render data
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

// const tableBody = `
//      <tbody>

//         <tr>
//           <td>Kaixing</td>
//           <td>3</td>
//           <td>100%</td>
//           <td>3</td>
//           <td>0</td>
//         </tr>
//         <tr>
//           <td>Kaixing</td>
//           <td>3</td>
//           <td>100%</td>
//           <td>3</td>
//           <td>0</td>
//         </tr>
//         <tr>
//           <td>Kaixing</td>
//           <td>3</td>
//           <td>100%</td>
//           <td>3</td>
//           <td>0</td>
//         </tr>
//       </tbody>
// `;
