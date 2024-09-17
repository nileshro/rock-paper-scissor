// Initialize variables
let scene, camera, renderer, model, controls;
let rockButton, paperButton, scissorsButton;
let rockSound, paperSound, scissorsSound;
let currentChoice, computerChoice, result;

// Initialize sounds
rockSound = new Audio('sounds/rock.mp3');
paperSound = new Audio('sounds/paper.mp3');
scissorsSound = new Audio('sounds/scissors.mp3');

// Get elements
rockButton = document.getElementById('rockButton');
paperButton = document.getElementById('paperButton');
scissorsButton = document.getElementById('scissorsButton');
controls = document.querySelector('.controls');
resultElement = document.getElementById('result');

// Initialize the scene
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add lights to the scene
  addLights();

  // Add event listeners to buttons
  rockButton.addEventListener('click', () => playRound('rock'));
  paperButton.addEventListener('click', () => playRound('paper'));
  scissorsButton.addEventListener('click', () => playRound('scissors'));

  animate();
}

// Function to add lights
function addLights() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
  directionalLight.position.set(5, 10, 7).normalize();
  scene.add(directionalLight);

  // Point light (dynamic light source)
  const pointLight = new THREE.PointLight(0xff0000, 1, 100); // Red light with a maximum distance
  pointLight.position.set(-10, 10, 10);
  scene.add(pointLight);
}

// Function to load a 3D model
async function loadModel(modelPath) {
  // Clear the scene
  while (scene.children.length > 0) {
    scene.remove(scene.children[0]);
  }

  const loader = new THREE.GLTFLoader();
  const gltf = await loader.loadAsync(modelPath);
  model = gltf.scene;
  scene.add(model);
}

// Function to play a round
async function playRound(userChoice) {
  currentChoice = userChoice;
  computerChoice = getComputerChoice();
  result = determineWinner(currentChoice, computerChoice);

  // Play sound based on user's choice
  switch (userChoice) {
    case 'rock':
      rockSound.play();
      break;
    case 'paper':
      paperSound.play();
      break;
    case 'scissors':
      scissorsSound.play();
      break;
  }

  // Load the corresponding 3D model
  await loadModel(`models/${userChoice}.gltf`);

  // Display the result
  resultElement.textContent = `You chose ${userChoice}, computer chose ${computerChoice}. ${result}`;
}

// Function to get the computer's choice
function getComputerChoice() {
  const choices = ['rock', 'paper', 'scissors'];
  return choices[Math.floor(Math.random() * choices.length)];
}

// Function to determine the winner
function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice) {
    return 'It\'s a tie!';
  }

  switch (userChoice) {
    case 'rock':
      return computerChoice === 'scissors' ? 'You win!' : 'Computer wins!';
    case 'paper':
      return computerChoice === 'rock' ? 'You win!' : 'Computer wins!';
    case 'scissors':
      return computerChoice === 'paper' ? 'You win!' : 'Computer wins!';
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.01; // Rotate the model
  }

  renderer.render(scene, camera);
}

// Initialize the game
init();