let table;
let wordPairs = [];
let currentWordIndex = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let gameActive = false;
let currentDirection = "en-ru";

// DOM elements
let timerElement, scoreElement, wordDisplayElement, optionsContainerElement;
let startButton, leaderboardButton, leaderboardBody;
let clearLeaderboardButton, backToGameButton, playerNameInput;

function preload() {
  try {
    // Try loading file with error handling
    table = loadTable('words.csv', 'csv', 'header');
  } catch (error) {
    console.warn('Cannot load file, using default data:', error);
    table = null;
  }
}

function setup() {
  noCanvas();
  
  // Initialize game elements first
  initializeGame();
  
  // Use default data directly to ensure game works
  if (!table || table.getRowCount() === 0) {
    console.log('Using default data');
    wordPairs = [
      { english: 'hello', russian: 'привет' },
      { english: 'house', russian: 'дом' },
      { english: 'cat', russian: 'кошка' },
      { english: 'dog', russian: 'собака' },
      { english: 'book', russian: 'книга' },
      { english: 'water', russian: 'вода' },
      { english: 'fire', russian: 'огонь' },
      { english: 'sun', russian: 'солнце' },
      { english: 'moon', russian: 'луна' },
      { english: 'tree', russian: 'дерево' }
    ];
    
    wordDisplayElement.html(`${wordPairs.length} default words loaded. Enter your name and start!`);
    startButton.show(); // Make sure start button is visible
  } else {
    loadAndProcessData();
  }
}

function initializeGame() {
  timerElement = select('#timer');
  scoreElement = select('#score');
  wordDisplayElement = select('#word-display');
  optionsContainerElement = select('#options-container');
  startButton = select('#start-btn');
  leaderboardButton = select('#leaderboard-btn');
  leaderboardBody = select('#leaderboard-body');
  clearLeaderboardButton = select('#clear-leaderboard-btn');
  backToGameButton = select('#back-to-game-btn');
  playerNameInput = select('#player-name');

  // Show loading message
  wordDisplayElement.html('Setting up game...');

  // Setup start button event
  startButton.mousePressed(() => {
    const playerName = playerNameInput.value().trim();
    if (!playerName) {
      alert("Please enter your name to start!");
      return;
    }
    initGame();
  });

  // Setup other button events
  if (leaderboardButton) leaderboardButton.mousePressed(() => showLeaderboard(leaderboardBody));
  if (clearLeaderboardButton) clearLeaderboardButton.mousePressed(clearLeaderboard);
  if (backToGameButton) backToGameButton.mousePressed(backToGame);
}

function loadAndProcessData() {
  wordPairs = [];
  
  if (!table || table.getRowCount() === 0) {
    console.warn('Table is empty');
    return;
  }

  console.log(`Rows in file: ${table.getRowCount()}`);
  
  for (let i = 0; i < table.getRowCount(); i++) {
    try {
      const row = table.getRow(i);
      
      // Read data safely
      const src = row.get('source_lang') || row.get(0);
      const tgt = row.get('target_lang') || row.get(1);
      const srcTxt = row.get('source_text') || row.get(2);
      const tgtTxt = row.get('target_text') || row.get(3);
      
      if (src && tgt && srcTxt && tgtTxt) {
        const srcStr = String(src).trim();
        const tgtStr = String(tgt).trim();
        const srcTxtStr = String(srcTxt).trim();
        const tgtTxtStr = String(tgtTxt).trim();
        
        if ((srcStr === 'английский' && tgtStr === 'русский') ||
            (srcStr === 'русский' && tgtStr === 'английский')) {
          wordPairs.push({
            english: srcStr === 'английский' ? srcTxtStr : tgtTxtStr,
            russian: srcStr === 'русский' ? srcTxtStr : tgtTxtStr
          });
        }
      }
    } catch (error) {
      console.warn(`Error in row ${i}:`, error);
    }
  }

  if (wordPairs.length === 0) {
    console.warn('No words loaded from file');
  } else {
    console.log(`${wordPairs.length} words loaded from file`);
    wordDisplayElement.html(`${wordPairs.length} words loaded. Enter your name and start!`);
  }
}

// Remaining functions stay the same with minimal changes
function initGame() {
  if (wordPairs.length === 0) {
    alert('No words available. Using default data.');
    // Add some default words if array is empty
    if (wordPairs.length === 0) {
      wordPairs = [
        { english: 'hello', russian: 'привет' },
        { english: 'goodbye', russian: 'до свидания' },
        { english: 'thank you', russian: 'спасибо' }
      ];
    }
  }
  
  score = 0;
  timeLeft = 60;
  currentWordIndex = 0;
  gameActive = true;

  scoreElement.html(`Score: ${score}`);
  timerElement.html(timeLeft);
  startButton.html("Restart Game");
  
  // Hide/show elements
  const nameInput = select('#name-input');
  const gameScreen = select('#game-screen');
  if (nameInput) nameInput.style('display', 'none');
  if (gameScreen) gameScreen.removeClass('hidden');

  showNextWord();
  startTimer();
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timerElement) timerElement.html(timeLeft);
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function showNextWord() {
  if (!gameActive || wordPairs.length === 0) return;
  
  if (currentWordIndex >= wordPairs.length) {
    shuffleArray(wordPairs);
    currentWordIndex = 0;
  }

  const currentPair = wordPairs[currentWordIndex];
  currentDirection = random() > 0.5 ? "en-ru" : "ru-en";

  if (wordDisplayElement) {
    wordDisplayElement.html(
      currentDirection === "en-ru" ? currentPair.english : currentPair.russian
    );
  }

  createOptions(currentPair);
}

function createOptions(correctPair) {
  if (!optionsContainerElement) return;
  
  optionsContainerElement.html('');

  const wrongOptions = [];
  const usedIndices = new Set([currentWordIndex]);

  while (wrongOptions.length < 3 && usedIndices.size < wordPairs.length) {
    const randIdx = floor(random(wordPairs.length));
    if (!usedIndices.has(randIdx)) {
      wrongOptions.push(wordPairs[randIdx]);
      usedIndices.add(randIdx);
    }
  }

  const allOptions = [correctPair, ...wrongOptions];
  shuffleArray(allOptions);

  allOptions.forEach(option => {
    const btn = createButton(
      currentDirection === "en-ru" ? option.russian : option.english
    );
    btn.parent(optionsContainerElement);
    btn.class('option');
    btn.mousePressed(() => checkAnswer(option === correctPair, btn));
  });
}

function checkAnswer(isCorrect, clickedBtn) {
  if (!gameActive) return;

  const buttons = selectAll('.option');
  const correctText = currentDirection === "en-ru"
    ? wordPairs[currentWordIndex].russian
    : wordPairs[currentWordIndex].english;

  buttons.forEach(btn => {
    if (btn.elt.textContent === correctText) {
      btn.addClass('correct');
    } else if (btn === clickedBtn && !isCorrect) {
      btn.addClass('incorrect');
    }
    btn.attribute('disabled', true);
  });

  if (isCorrect) {
    score += 10;
    if (scoreElement) scoreElement.html(`Score: ${score}`);
    setTimeout(() => {
      currentWordIndex++;
      showNextWord();
    }, 1500);
  } else {
    setTimeout(endGame, 1500);
  }
}

function endGame() {
  gameActive = false;
  if (timerInterval) clearInterval(timerInterval);
  
  saveScore();
  
  if (wordDisplayElement) wordDisplayElement.html(`Game Over! Final Score: ${score}`);
  if (optionsContainerElement) {
    optionsContainerElement.html('');
    
    const leaderboardBtn = createButton('Show Leaderboard');
    leaderboardBtn.parent(optionsContainerElement);
    leaderboardBtn.mousePressed(() => {
      showLeaderboard(select('#leaderboard-body'));
    });
  }
  
  const nameInput = select('#name-input');
  const gameScreen = select('#game-screen');
  if (nameInput) nameInput.style('display', 'block');
  if (gameScreen) gameScreen.addClass('hidden');
}

function saveScore() {
  const playerName = (playerNameInput && playerNameInput.value().trim()) || 'Player';
  let leaderboard = getLeaderboard();
  leaderboard.push({ 
    name: playerName, 
    score: score, 
    date: new Date().toLocaleDateString() 
  });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) leaderboard.pop();
  localStorage.setItem('wordGameLeaderboard', JSON.stringify(leaderboard));
}

function getLeaderboard() {
  const data = localStorage.getItem('wordGameLeaderboard');
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
}

function showLeaderboard(leaderboardBody) {
  const gameScreen = select('#game-screen');
  const leaderboardScreen = select('#leaderboard-screen');
  
  if (gameScreen) gameScreen.addClass('hidden');
  if (leaderboardScreen) leaderboardScreen.removeClass('hidden');
  
  if (!leaderboardBody) return;
  
  leaderboardBody.html('');

  const leaderboard = getLeaderboard();
  if (leaderboard.length === 0) {
    const row = createElement('tr');
    const cell = createElement('td', 'No results yet');
    cell.attribute('colspan', '4');
    row.child(cell);
    leaderboardBody.child(row);
  } else {
    leaderboard.forEach((entry, i) => {
      if (!entry) return;
      
      const row = createElement('tr');
      row.child(createElement('td', (i + 1).toString()));
      row.child(createElement('td', entry.name || 'Unknown'));
      row.child(createElement('td', entry.score ? entry.score.toString() : '0'));
      row.child(createElement('td', entry.date || 'Unknown date'));
      leaderboardBody.child(row);
    });
  }
}

function clearLeaderboard() {
  if (confirm("Are you sure you want to clear the leaderboard?")) {
    localStorage.removeItem("wordGameLeaderboard");
    showLeaderboard(select("#leaderboard-body"));
  }
}

function backToGame() {
  const leaderboardScreen = select("#leaderboard-screen");
  const gameScreen = select("#game-screen");
  const nameInput = select("#name-input");
  
  if (leaderboardScreen) leaderboardScreen.addClass("hidden");
  if (gameScreen) gameScreen.removeClass("hidden");
  if (nameInput) nameInput.style('display', 'block');
}

function shuffleArray(array) {
  if (!array || array.length === 0) {
    return array;
  }
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random(i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
