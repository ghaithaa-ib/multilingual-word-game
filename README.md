Multilingual Word Game
Learn languages through play!

Project Description
An interactive educational game that helps users learn translation between English and Russian (easily extensible to any language pair).
Built with p5.js, the game runs directly in the browser with no installation required.

Key Features
Feature	Description
Load words from CSV	Supports thousands of words with ease
Bidirectional translation	English to Russian or Russian to English
4 answer choices per question	1 correct + 3 incorrect
60-second timer	Adds challenge and excitement
Scoring system	+10 points for each correct answer
Instant visual feedback	Green for correct, red for incorrect
Leaderboard	Saves top 10 scores locally
Beautiful & responsive UI	Works on mobile and desktop
How to Run (Locally)
Clone the repository:

bash
git clone https://github.com/YourUsername/multilingual-word-game.git
cd multilingual-word-game
Open index.html in your browser (no server needed!)

Or use a local server:

bash
npx serve
How to Run (via GitHub Pages)
Go to Settings → Pages

Select branch main and folder / (root)

Wait for deployment - you'll get a link like:

text
https://YourUsername.github.io/multilingual-word-game
Project Structure
text
multilingual-word-game/
│
├── index.html          # Front-end interface
├── sketch.js           # Game logic (p5.js)
├── words.csv           # Word database
├── style.css           # Additional styling
├── image.png           # Project requirements image
└── README.md           # This file
Adding New Words
Open words.csv and add new lines in this format:

csv
source_lang,target_lang,source_text,target_text
английский,русский,hello,привет
русский,английский,спасибо,thank you
Make sure to save the file in UTF-8 encoding

Technologies Used
p5.js – For graphics and interaction

CSV Parsing – Dynamic data loading

localStorage – Persistent leaderboard

Vanilla JavaScript – No external dependencies

Responsive CSS – Mobile-friendly design

Contributing
Contributions are welcome!
Open an Issue or Pull Request if you want to:




Developer
Name: [Ghaithaa]

GitHub: @ghaithaa-ib

Email: your.email@example.com (optional)

License
MIT License – Feel free to use, modify, and distribute the code.

