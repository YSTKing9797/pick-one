/* =========================================
   50% CHALLENGE
   - 1日1回プレイ
   - ラウンド上限なし
   - English / Japanese
   - Daily answer
   - Coin flip
   - Hint
   - Streak
   - Probability
   - Share card
========================================= */


/* =========================================
   DAILY SYSTEM
========================================= */

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}


function getDailyNumber() {
  const startDate =
    new Date("2026-01-01T00:00:00Z");

  const today =
    new Date(
      getTodayString() + "T00:00:00Z"
    );

  const difference =
    today.getTime() -
    startDate.getTime();

  const days =
    Math.floor(
      difference / 86400000
    );

  return days + 1;
}


/* =========================================
   ONE PLAY PER DAY
========================================= */

const PLAYED_KEY =
  "50challenge_played_date";


function hasPlayedToday() {
  return (
    localStorage.getItem(PLAYED_KEY) ===
    getTodayString()
  );
}


function markPlayedToday() {
  localStorage.setItem(
    PLAYED_KEY,
    getTodayString()
  );
}


/* =========================================
   SEEDED RANDOM
========================================= */

function createSeed(str) {

  let hash = 2166136261;

  for (
    let i = 0;
    i < str.length;
    i++
  ) {

    hash ^=
      str.charCodeAt(i);

    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);

  }

  return hash >>> 0;
}


function seededRandom(seed) {

  let x = seed;

  x += 0x6D2B79F5;

  let t = x;

  t =
    Math.imul(
      t ^ (t >>> 15),
      t | 1
    );

  t ^=
    t +
    Math.imul(
      t ^ (t >>> 7),
      t | 61
    );

  return (
    (t ^ (t >>> 14)) >>> 0
  ) / 4294967296;

}


/* =========================================
   DAILY ANSWER
========================================= */

function getDailyAnswer(round) {

  const today =
    getTodayString();

  const seedString =
    today +
    "-" +
    round;

  const seed =
    createSeed(seedString);

  const random =
    seededRandom(seed);

  return random < 0.5
    ? "heads"
    : "tails";
}


/* =========================================
   ELEMENTS
========================================= */

const dailyNumber =
  document.getElementById("dailyNumber");

const coin =
  document.getElementById("coin");

const coinGlow =
  document.getElementById("coinGlow");

const result =
  document.getElementById("result");

const probability =
  document.getElementById("probability");

const streakElement =
  document.getElementById("streak");

const roundElement =
  document.getElementById("round");

const headsButton =
  document.getElementById("headsButton");

const tailsButton =
  document.getElementById("tailsButton");

const hintButton =
  document.getElementById("hintButton");

const hintResult =
  document.getElementById("hintResult");

const flipButton =
  document.getElementById("flipButton");

const message =
  document.getElementById("message");

const gameOverElement =
  document.getElementById("gameOver");

const finalScore =
  document.getElementById("finalScore");

const restartButton =
  document.getElementById("restartButton");

const flash =
  document.getElementById("flash");

const successBanner =
  document.getElementById("successBanner");

const shareArea =
  document.getElementById("shareArea");

const shareButton =
  document.getElementById("shareButton");

const shareStatus =
  document.getElementById("shareStatus");

const languageButton =
  document.getElementById("languageButton");

const description =
  document.getElementById("description");

const question =
  document.getElementById("question");

const gameOverSub =
  document.getElementById("gameOverSub");


/* =========================================
   DAILY NUMBER
========================================= */

dailyNumber.textContent =
  "🌎 DAILY #" +
  getDailyNumber();


/* =========================================
   GAME STATE
========================================= */

let selected = null;

let gameOver = false;

let flipping = false;

let streak = 0;

let hintUsed = false;

let hintedResult = null;

let resultHistory = [];


/* =========================================
   LANGUAGE
========================================= */

let currentLanguage = "en";


const translations = {

  en: {

    dailyLabel:
      "DAILY CHALLENGE",

    title:
      "50% CHALLENGE",

    description:
      "Everyone gets the same challenge today.<br>Keep choosing correctly and see how far you can go.",

    probabilityLabel:
      "CHANCE OF GETTING THIS FAR",

    streakLabel:
      "CORRECT IN A ROW",

    heads:
      "HEADS",

    tails:
      "TAILS",

    hintButton:
      "ELIMINATE ONE WRONG CHOICE",

    shareTitle:
      "SHARE YOUR RESULT",

    shareButton:
      "SHARE RESULT",

    restart:
      "PLAY AGAIN"

  },


  ja: {

    dailyLabel:
      "デイリーチャレンジ",

    title:
      "50% チャレンジ",

    description:
      "今日の挑戦はみんな同じ。<br>正解し続けて、どこまで行けるか挑戦しよう。",

    probabilityLabel:
      "ここまで来られる確率",

    streakLabel:
      "連続正解",

    heads:
      "表",

    tails:
      "裏",

    hintButton:
      "間違っている方を1つ消す",

    shareTitle:
      "結果をシェア",

    shareButton:
      "結果をシェアする",

    restart:
      "もう一度プレイ"

  }

};


/* =========================================
   LANGUAGE UPDATE
========================================= */

function updateLanguage() {

  const texts =
    translations[currentLanguage];

  document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

      const key =
        element.dataset.i18n;

      if (
        texts[key] !== undefined
      ) {

        element.innerHTML =
          texts[key];

      }

    });


  if (
    currentLanguage === "en"
  ) {

    languageButton.textContent =
      "🇯🇵 日本語にする";

  } else {

    languageButton.textContent =
      "🇺🇸 Switch to English";

  }


  updateDynamicText();

  updateDailyLimitMessage();
}


/* =========================================
   DAILY LIMIT MESSAGE
========================================= */

function updateDailyLimitMessage() {

  if (
    !hasPlayedToday() ||
    !gameOver
  ) {
    return;
  }


  if (
    currentLanguage === "ja"
  ) {

    message.innerHTML =
      "🔒 今日はもう挑戦済みです。<br>明日また挑戦してください！";

  } else {

    message.innerHTML =
      "🔒 You've already played today.<br>Come back tomorrow!";

  }

}


function showDailyLimit() {

  gameOver = true;

  headsButton.disabled = true;
  tailsButton.disabled = true;
  flipButton.disabled = true;
  hintButton.disabled = true;

  gameOverElement.classList.remove("show");
  shareArea.classList.remove("show");

  result.classList.remove(
    "success",
    "fail"
  );

  coin.classList.remove(
    "flipping",
    "success",
    "fail"
  );

  coin.textContent = "🔒";

  result.textContent =
    currentLanguage === "ja"
      ? "今日は終了！"
      : "TODAY'S CHALLENGE IS OVER";

  updateDailyLimitMessage();

}


/* =========================================
   DYNAMIC TEXT
========================================= */

function updateDynamicText() {

  if (
    hasPlayedToday() &&
    gameOver
  ) {

    updateDailyLimitMessage();

    return;

  }


  if (gameOver) {
    return;
  }


  if (flipping) {
    return;
  }


  if (selected === null) {

    if (
      currentLanguage === "ja"
    ) {

      question.textContent =
        "運命を予想しよう";

      flipButton.textContent =
        "表か裏を選んでください";

    } else {

      question.textContent =
        "Predict the fate";

      flipButton.textContent =
        "SELECT HEADS OR TAILS";

    }

  } else {

    if (
      currentLanguage === "ja"
    ) {

      question.textContent =
        "予想は決まった？";

      flipButton.textContent =
        "🪙 コインを投げる";

    } else {

      question.textContent =
        "Predict the fate";

      flipButton.textContent =
        "🪙 FLIP THE COIN";

    }

  }

}


/* =========================================
   LANGUAGE BUTTON
========================================= */

languageButton.addEventListener(
  "click",
  () => {

    currentLanguage =
      currentLanguage === "en"
        ? "ja"
        : "en";

    updateLanguage();

  }
);


/* =========================================
   PROBABILITY
========================================= */

function getProbability() {

  return (
    Math.pow(
      0.5,
      streak
    ) * 100
  );

}


function getProbabilityText() {

  const chance =
    getProbability();


  if (
    chance >= 1
  ) {

    return (
      chance
        .toFixed(8)
        .replace(/0+$/, "")
        .replace(/\.$/, "")
      + "%"
    );

  }


  if (
    chance >= 0.000001
  ) {

    return (
      chance
        .toFixed(10)
        .replace(/0+$/, "")
        .replace(/\.$/, "")
      + "%"
    );

  }


  return (
    chance
      .toExponential(6)
    + "%"
  );

}


/* =========================================
   UPDATE PROBABILITY
========================================= */

function updateProbability(
  animate = false
) {

  probability.textContent =
    getProbabilityText();

  const chance =
    getProbability();


  if (
    chance >= 25
  ) {

    probability.style.color =
      "#22c55e";

  } else if (
    chance >= 5
  ) {

    probability.style.color =
      "#facc15";

  } else {

    probability.style.color =
      "#c084fc";

  }


  if (
    animate
  ) {

    probability.classList.remove(
      "pop"
    );

    void probability.offsetWidth;

    probability.classList.add(
      "pop"
    );

  }

}


/* =========================================
   UPDATE STATS
========================================= */

function updateStats(
  animate = false
) {

  streakElement.textContent =
    streak;

  updateProbability(
    animate
  );


  roundElement.textContent =
    currentLanguage === "ja"
      ? "ラウンド " +
        (streak + 1)
      : "ROUND " +
        (streak + 1);


  if (
    animate
  ) {

    streakElement.classList.remove(
      "pop"
    );

    void streakElement.offsetWidth;

    streakElement.classList.add(
      "pop"
    );

  }

}


/* =========================================
   HEADS
========================================= */

headsButton.addEventListener(
  "click",
  () => {

    if (
      gameOver ||
      flipping ||
      hasPlayedToday()
    ) {

      return;

    }


    selected =
      "heads";


    headsButton.classList.add(
      "selected"
    );

    tailsButton.classList.remove(
      "selected"
    );


    flipButton.disabled =
      false;


    if (
      currentLanguage === "ja"
    ) {

      flipButton.textContent =
        "🪙 コインを投げる";

      message.textContent =
        "表を選択しました。運命を見てみよう…";

    } else {

      flipButton.textContent =
        "🪙 FLIP THE COIN";

      message.textContent =
        "HEADS selected. Let's see what fate decides...";

    }

  }
);


/* =========================================
   TAILS
========================================= */

tailsButton.addEventListener(
  "click",
  () => {

    if (
      gameOver ||
      flipping ||
      hasPlayedToday()
    ) {

      return;

    }


    selected =
      "tails";


    tailsButton.classList.add(
      "selected"
    );

    headsButton.classList.remove(
      "selected"
    );


    flipButton.disabled =
      false;


    if (
      currentLanguage === "ja"
    ) {

      flipButton.textContent =
        "🪙 コインを投げる";

      message.textContent =
        "裏を選択しました。運命を見てみよう…";

    } else {

      flipButton.textContent =
        "🪙 FLIP THE COIN";

      message.textContent =
        "TAILS selected. Let's see what fate decides...";

    }

  }
);


/* =========================================
   HINT
========================================= */

hintButton.addEventListener(
  "click",
  () => {

    if (
      hintUsed ||
      gameOver ||
      flipping ||
      hasPlayedToday()
    ) {

      return;

    }


    const currentRound =
      streak + 1;


    const correctAnswer =
      getDailyAnswer(
        currentRound
      );


    const wrongAnswer =
      correctAnswer === "heads"
        ? "HEADS"
        : "TAILS";


    hintUsed =
      true;


    hintButton.classList.add(
      "used"
    );


    if (
      currentLanguage === "ja"
    ) {

      const japaneseWrong =
        wrongAnswer === "HEADS"
          ? "表"
          : "裏";


      hintResult.textContent =
        `🔮 間違いは「${japaneseWrong}」です`;

    } else {

      hintResult.textContent =
        `🔮 The wrong answer is ${wrongAnswer}`;

    }


    hintResult.classList.add(
      "show"
    );


    hintedResult =
      correctAnswer;


    message.textContent =
      currentLanguage === "ja"
        ? "ヒントを使いました。慎重に選ぼう。"
        : "Hint used. Choose wisely.";

  }
);


/* =========================================
   FLIP
========================================= */

flipButton.addEventListener(
  "click",
  () => {

    if (
      !selected ||
      gameOver ||
      flipping ||
      hasPlayedToday()
    ) {

      return;

    }


    flipping =
      true;


    flipButton.disabled =
      true;

    headsButton.disabled =
      true;

    tailsButton.disabled =
      true;


    const currentRound =
      streak + 1;


    let correctAnswer;


    if (
      hintedResult !== null
    ) {

      correctAnswer =
        hintedResult;

      hintedResult =
        null;

    } else {

      correctAnswer =
        getDailyAnswer(
          currentRound
        );

    }


    coin.classList.remove(
      "flipping",
      "success",
      "fail"
    );


    void coin.offsetWidth;


    coin.classList.add(
      "flipping"
    );


    setTimeout(
      () => {

        coin.textContent =
          correctAnswer === "heads"
            ? "HEADS"
            : "TAILS";


        coin.classList.remove(
          "flipping"
        );


        /* =================================
           CORRECT
        ================================= */

        if (
          selected === correctAnswer
        ) {

          streak++;

          resultHistory.push(
            true
          );

          updateStats(
            true
          );

          coin.classList.add(
            "success"
          );

          coinGlow.classList.remove(
            "fail"
          );

          coinGlow.classList.add(
            "success"
          );

          result.classList.remove(
            "fail"
          );

          result.classList.add(
            "success"
          );

          result.textContent =
            currentLanguage === "ja"
              ? "🎉 正解！"
              : "🎉 CORRECT!";

          message.textContent =
            currentLanguage === "ja"
              ? `ここまで来られる確率は ${getProbabilityText()}`
              : `Your chance of getting this far is ${getProbabilityText()}`;


          /* Flash */

          flash.classList.remove(
            "active"
          );

          void flash.offsetWidth;

          flash.classList.add(
            "active"
          );


          /* Banner */

          successBanner.classList.remove(
            "show"
          );

          void successBanner.offsetWidth;

          successBanner.classList.add(
            "show"
          );


          /* Confetti */

          createConfetti(
            streak >= 5
              ? 80
              : 35
          );


          selected =
            null;


          headsButton.classList.remove(
            "selected"
          );

          tailsButton.classList.remove(
            "selected"
          );


          headsButton.disabled =
            false;

          tailsButton.disabled =
            false;


          flipButton.disabled =
            true;


          flipping =
            false;


          updateDynamicText();

        }


        /* =================================
           WRONG
        ================================= */

        else {

          /*

             ここで初めて
             「今日プレイした」と記録。

             つまり途中で何回正解しても、
             最後に間違えた時点で
             その日のプレイが終了する。

          */

          markPlayedToday();

          gameOver =
            true;


          resultHistory.push(
            false
          );


          coin.classList.add(
            "fail"
          );


          coinGlow.classList.remove(
            "success"
          );

          coinGlow.classList.add(
            "fail"
          );


          result.classList.remove(
            "success"
          );

          result.classList.add(
            "fail"
          );


          result.textContent =
            currentLanguage === "ja"
              ? "💥 不正解！"
              : "💥 WRONG!";


          message.textContent =
            currentLanguage === "ja"
              ? "50%の壁に負けました。今日はもう終了です。明日また挑戦してください！"
              : "The 50% wall got you. You're done for today. Come back tomorrow!";


          /* Shake */

          document.body.classList.remove(
            "shake"
          );

          void document.body.offsetWidth;

          document.body.classList.add(
            "shake"
          );


          /* Final score */

          if (
            currentLanguage === "ja"
          ) {

            finalScore.innerHTML = `
              デイリー #${getDailyNumber()}

              <br><br>

              連続正解

              <br>

              <strong>
                ${streak} 回
              </strong>

              <br><br>

              ここまで来られる確率

              <br>

              <strong>
                ${getProbabilityText()}
              </strong>
            `;

            gameOverSub.textContent =
              "50%の壁に敗北";

          } else {

            finalScore.innerHTML = `
              DAILY #${getDailyNumber()}

              <br><br>

              YOU GOT

              <br>

              <strong>
                ${streak} CORRECT IN A ROW
              </strong>

              <br><br>

              CHANCE OF GETTING THIS FAR

              <br>

              <strong>
                ${getProbabilityText()}
              </strong>
            `;

            gameOverSub.textContent =
              "THE 50% WALL WON";

          }


          gameOverElement.classList.add(
            "show"
          );


          shareArea.classList.add(
            "show"
          );


          headsButton.disabled =
            true;

          tailsButton.disabled =
            true;


          hintButton.disabled =
            true;


          flipping =
            false;

        }

      },

      1100
    );

  }
);


/* =========================================
   CONFETTI
========================================= */

function createConfetti(
  amount
) {

  const colors = [

    "#22c55e",
    "#4ade80",
    "#86efac",
    "#facc15",
    "#38bdf8",
    "#a855f7",
    "#f472b6",
    "#ffffff"

  ];


  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const piece =
      document.createElement(
        "div"
      );


    piece.className =
      "confetti";


    const color =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    piece.style.background =
      color;


    piece.style.left =
      Math.random() *
      100 +
      "vw";


    piece.style.setProperty(
      "--duration",
      (
        2 +
        Math.random() * 2
      ) +
      "s"
    );


    piece.style.setProperty(
      "--drift",
      (
        (
          Math.random() -
          0.5
        ) *
        300
      ) +
      "px"
    );


    piece.style.width =
      (
        6 +
        Math.random() * 7
      ) +
      "px";


    piece.style.height =
      (
        9 +
        Math.random() * 10
      ) +
      "px";


    document.body.appendChild(
      piece
    );


    setTimeout(
      () => {
        piece.remove();
      },
      4500
    );

  }

}


/* =========================================
   SHARE CARD
========================================= */

function createShareCard() {

  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    1080;

  canvas.height =
    1350;


  const ctx =
    canvas.getContext(
      "2d"
    );


  const background =
    ctx.createLinearGradient(
      0,
      0,
      1080,
      1350
    );


  background.addColorStop(
    0,
    "#172554"
  );

  background.addColorStop(
    0.45,
    "#0f172a"
  );

  background.addColorStop(
    1,
    "#030712"
  );


  ctx.fillStyle =
    background;


  ctx.fillRect(
    0,
    0,
    1080,
    1350
  );


  const glow =
    ctx.createRadialGradient(
      540,
      160,
      20,
      540,
      160,
      600
    );


  glow.addColorStop(
    0,
    "rgba(56,189,248,0.22)"
  );

  glow.addColorStop(
    0.45,
    "rgba(99,102,241,0.08)"
  );

  glow.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );


  ctx.fillStyle =
    glow;


  ctx.fillRect(
    0,
    0,
    1080,
    800
  );


  ctx.textAlign =
    "center";


  ctx.fillStyle =
    "#64748b";

  ctx.font =
    "900 30px Arial";

  ctx.fillText(
    currentLanguage === "ja"
      ? "デイリーチャレンジ"
      : "DAILY CHALLENGE",
    540,
    105
  );


  ctx.fillStyle =
    "#e2e8f0";

  ctx.font =
    "900 40px Arial";

  ctx.fillText(
    `DAILY #${getDailyNumber()}`,
    540,
    165
  );


  const titleGradient =
    ctx.createLinearGradient(
      250,
      0,
      830,
      0
    );


  titleGradient.addColorStop(
    0,
    "#ffffff"
  );

  titleGradient.addColorStop(
    0.5,
    "#bae6fd"
  );

  titleGradient.addColorStop(
    1,
    "#a78bfa"
  );


  ctx.fillStyle =
    titleGradient;


  ctx.font =
    "950 78px Arial";


  ctx.fillText(
    currentLanguage === "ja"
      ? "50% チャレンジ"
      : "50% CHALLENGE",
    540,
    285
  );


  const startY =
    430;

  const boxSize =
    92;

  const gap =
    20;

  const columns =
    5;


  resultHistory.forEach(
    (
      correct,
      index
    ) => {

      const row =
        Math.floor(
          index / columns
        );

      const column =
        index % columns;

      const totalWidth =
        columns *
        boxSize +
        (
          columns - 1
        ) *
        gap;

      const startX =
        (
          1080 -
          totalWidth
        ) / 2;

      const x =
        startX +
        column *
        (
          boxSize +
          gap
        );

      const y =
        startY +
        row *
        (
          boxSize +
          gap
        );


      ctx.beginPath();

      ctx.roundRect(
        x,
        y,
        boxSize,
        boxSize,
        20
      );


      ctx.fillStyle =
        correct
          ? "#22c55e"
          : "#ef4444";


      ctx.fill();


      ctx.fillStyle =
        "rgba(255,255,255,0.95)";

      ctx.font =
        "900 38px Arial";


      ctx.fillText(
        correct
          ? "✓"
          : "×",
        x +
          boxSize / 2,
        y + 60
      );

    }
  );


  const scoreY =
    startY +
    Math.ceil(
      resultHistory.length /
      columns
    ) *
    (
      boxSize +
      gap
    ) +
    80;


  ctx.fillStyle =
    "#94a3b8";


  ctx.font =
    "900 28px Arial";


  ctx.fillText(
    currentLanguage === "ja"
      ? "連続正解"
      : "CORRECT IN A ROW",
    540,
    scoreY
  );


  ctx.fillStyle =
    "#ffffff";


  ctx.font =
    "1000 90px Arial";


  ctx.fillText(
    streak,
    540,
    scoreY + 100
  );


  ctx.fillStyle =
    "#94a3b8";


  ctx.font =
    "900 26px Arial";


  ctx.fillText(
    currentLanguage === "ja"
      ? "ここまで来られる確率"
      : "CHANCE OF GETTING THIS FAR",
    540,
    scoreY + 170
  );


  ctx.fillStyle =
    "#a78bfa";


  ctx.font =
    "950 48px Arial";


  ctx.fillText(
    getProbabilityText(),
    540,
    scoreY + 225
  );


  ctx.fillStyle =
    "#64748b";


  ctx.font =
    "700 28px Arial";


  ctx.fillText(
    currentLanguage === "ja"
      ? "あなたは超えられる？"
      : "CAN YOU BEAT ME?",
    540,
    1240
  );


  ctx.fillStyle =
    "#475569";


  ctx.font =
    "900 23px Arial";


  ctx.fillText(
    "50% CHALLENGE",
    540,
    1295
  );


  return canvas;

}


/* =========================================
   SHARE RESULT
========================================= */

shareButton.addEventListener(
  "click",
  async () => {

    shareStatus.textContent =
      currentLanguage === "ja"
        ? "結果カードを作成しています..."
        : "Creating your result card...";


    try {

      const canvas =
        createShareCard();


      const blob =
        await new Promise(
          resolve => {

            canvas.toBlob(
              resolve,
              "image/png"
            );

          }
        );


      if (
        !blob
      ) {

        throw new Error(
          "Could not create image."
        );

      }


      const file =
        new File(
          [
            blob
          ],
          `daily-${getDailyNumber()}-result.png`,
          {
            type:
              "image/png"
          }
        );


      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [file]
        })
      ) {

        await navigator.share({

          title:
            `Daily #${getDailyNumber()} - 50% Challenge`,

          text:
            currentLanguage === "ja"
              ? `50/50チャレンジで${streak}回連続正解しました！あなたは超えられる？`
              : `I got ${streak} correct in a row on today's 50% Challenge. Can you beat me?`,

          files: [
            file
          ]

        });


        shareStatus.textContent =
          currentLanguage === "ja"
            ? "結果をシェアしました！"
            : "Result shared!";


        return;

      }


      const url =
        URL.createObjectURL(
          blob
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        url;


      link.download =
        `daily-${getDailyNumber()}-result.png`;


      document.body.appendChild(
        link
      );


      link.click();


      link.remove();


      URL.revokeObjectURL(
        url
      );


      shareStatus.textContent =
        currentLanguage === "ja"
          ? "結果カードをダウンロードしました！"
          : "Result card downloaded!";

    }


    catch (error) {

      if (
        error &&
        error.name ===
        "AbortError"
      ) {

        shareStatus.textContent =
          currentLanguage === "ja"
            ? "シェアをキャンセルしました。"
            : "Share cancelled.";

        return;

      }


      shareStatus.textContent =
        currentLanguage === "ja"
          ? "自動シェアできませんでした。もう一度試してください。"
          : "Could not share automatically. Try again.";


      console.error(
        error
      );

    }

  }
);


/* =========================================
   RESTART
========================================= */

restartButton.addEventListener(
  "click",
  () => {

    /*
      今日すでにプレイ済みなら
      再スタートさせない。
    */

    if (
      hasPlayedToday()
    ) {

      showDailyLimit();

      return;

    }


    selected =
      null;

    gameOver =
      false;

    flipping =
      false;

    streak =
      0;

    hintUsed =
      false;

    hintedResult =
      null;

    resultHistory =
      [];


    coin.classList.remove(
      "flipping",
      "success",
      "fail"
    );


    coin.textContent =
      "?";


    coinGlow.classList.remove(
      "success",
      "fail"
    );


    result.classList.remove(
      "success",
      "fail"
    );


    result.textContent =
      currentLanguage === "ja"
        ? "表か裏？"
        : "HEADS OR TAILS?";


    message.textContent =
      currentLanguage === "ja"
        ? "今日のチャレンジは日付によって決まります。"
        : "Today's challenge is determined by the date.";


    headsButton.disabled =
      false;

    tailsButton.disabled =
      false;


    hintButton.disabled =
      false;


    headsButton.classList.remove(
      "selected"
    );

    tailsButton.classList.remove(
      "selected"
    );


    flipButton.disabled =
      true;


    flipButton.textContent =
      currentLanguage === "ja"
        ? "表か裏を選んでください"
        : "SELECT HEADS OR TAILS";


    hintButton.classList.remove(
      "used"
    );


    hintResult.classList.remove(
      "show"
    );


    hintResult.textContent =
      "";


    gameOverElement.classList.remove(
      "show"
    );


    shareArea.classList.remove(
      "show"
    );


    shareStatus.textContent =
      "";


    updateStats();

    updateDynamicText();


    document.body.classList.remove(
      "shake"
    );

  }
);


/* =========================================
   INITIALIZE
========================================= */

updateLanguage();

updateStats();


/*
  ページを開いた時点で
  今日すでにプレイ済みなら
  そのまま「今日は終了」状態にする。
*/

if (
  hasPlayedToday()
) {

  showDailyLimit();

}
