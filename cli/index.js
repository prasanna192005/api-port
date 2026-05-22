#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { select, Separator, input as prompt } from '@inquirer/prompts';
import figlet from 'figlet';

const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const BASE_URL = isLocal ? 'http://localhost:3000' : 'https://api.prasanna19.xyz';

/**
 * THE BREACH
 * Analytical code-breaking game.
 */
async function startBreach() {
  const CODE_LENGTH = 4;
  const secret = Math.floor(Math.random() * Math.pow(10, CODE_LENGTH)).toString().padStart(CODE_LENGTH, '0');
  const attempts = 6;
  let currentAttempt = 0;
  let solved = false;
  const history = [];

  while (currentAttempt < attempts && !solved) {
    console.clear();
    try {
      const ascii = figlet.textSync('THE BREACH', { font: 'Standard', horizontalLayout: 'fitted' });
      console.log(chalk.white.bold(ascii));
    } catch (e) {
      console.log(chalk.bold('FIREWALL CHALLENGE: THE BREACH'));
    }
    console.log(chalk.dim('─'.repeat(50)));
    console.log(`  Rules: Guess the secret ${CODE_LENGTH}-digit decimal code (0-9).`);
    console.log(`         Find the passcode before running out of attempts.`);
    console.log(chalk.dim('─'.repeat(50)));
    console.log('');
    
    const remaining = attempts - currentAttempt;
    const meter = '■'.repeat(currentAttempt) + '□'.repeat(remaining);
    console.log(`  Attempts: [ ${meter} ] (${currentAttempt}/${attempts})`);
    console.log('');

    if (history.length > 0) {
      console.log(chalk.bold('  ATTEMPT HISTORY'));
      history.forEach((h, idx) => {
        const totalSymbols = h.correctSymbols + h.correctPositions;
        console.log(`   ${idx + 1}. ${chalk.white.bold(h.guess)}  ──  ${chalk.yellow(`${totalSymbols} correct symbols`)} ${chalk.dim('|')} ${chalk.green(`${h.correctPositions} in correct positions`)}`);
      });
      console.log('');
    }

    const guess = await prompt({
      message: 'Enter code:',
      validate: (val) => new RegExp(`^[0-9]{${CODE_LENGTH}}$`).test(val) || `Must be a ${CODE_LENGTH}-digit number.`
    });

    currentAttempt++;

    if (guess === secret) {
      solved = true;
      break;
    }

    // Mastermind Logic
    let correctSymbols = 0;
    let correctPositions = 0;
    const secretArr = secret.split('');
    const guessArr = guess.split('');
    const secretMarked = new Array(CODE_LENGTH).fill(false);
    const guessMarked = new Array(CODE_LENGTH).fill(false);

    // 1. Check correct positions
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (guessArr[i] === secretArr[i]) {
        correctPositions++;
        secretMarked[i] = true;
        guessMarked[i] = true;
      }
    }

    // 2. Check correct symbols in wrong positions
    for (let i = 0; i < CODE_LENGTH; i++) {
      if (!guessMarked[i]) {
        for (let j = 0; j < CODE_LENGTH; j++) {
          if (!secretMarked[j] && guessArr[i] === secretArr[j]) {
            correctSymbols++;
            secretMarked[j] = true;
            break;
          }
        }
      }
    }

    history.push({ guess, correctSymbols, correctPositions });
  }

  console.clear();
  try {
    const ascii = figlet.textSync('THE BREACH', { font: 'Standard', horizontalLayout: 'fitted' });
    console.log(chalk.white.bold(ascii));
  } catch (e) {
    console.log(chalk.bold('FIREWALL CHALLENGE: THE BREACH'));
  }
  console.log(chalk.dim('─'.repeat(50)));

  if (solved) {
    console.log(chalk.green('✓ Access Granted'));
    console.log(chalk.dim('─'.repeat(50)));
    console.log(`${chalk.bold('System Status:')}  Authenticated`);
    console.log(`${chalk.bold('Decoded Key:')}    ${chalk.green.bold(secret)}`);
    console.log(`${chalk.bold('Payload:')}        Welcome, Administrator.`);
    console.log(chalk.dim('─'.repeat(50)));
    console.log(chalk.dim.italic('  "True power lies in the raw data, not the UI slop."'));
  } else {
    console.log(chalk.red('✗ Access Denied'));
    console.log(chalk.dim('─'.repeat(50)));
    console.log(`${chalk.bold('System Status:')}  Permanently Locked`);
    console.log(`${chalk.bold('Correct Key:')}    ${secret}`);
    console.log(chalk.dim('─'.repeat(50)));
  }
  console.log('');

  await new Promise(r => setTimeout(r, 4000));
  console.clear();
}

/**
 * PACKET ROUTING
 * Pathfinding network puzzle.
 */
async function startRoutingGame() {
  const ROUTING_LEVELS = [
    {
      name: 'Subnet Gateway',
      size: 5,
      start: [0, 0],
      end: [4, 4],
      firewalls: [
        [1, 1], [2, 1], [3, 1], [3, 3]
      ],
      maxMoves: 8
    },
    {
      name: 'Intranet Firewall',
      size: 6,
      start: [0, 0],
      end: [5, 5],
      firewalls: [
        [1, 0], [1, 1], [1, 2],
        [3, 3], [3, 4], [3, 5],
        [4, 1], [5, 1]
      ],
      maxMoves: 12
    },
    {
      name: 'Core Router Access',
      size: 7,
      start: [0, 0],
      end: [6, 6],
      firewalls: [
        [0, 2], [0, 5],
        [1, 2], [1, 5],
        [2, 2], [2, 3], [2, 4],
        [3, 0], [3, 4], [3, 5],
        [4, 2], [4, 4],
        [5, 0], [5, 2], [5, 4], [5, 5],
        [6, 2]
      ],
      maxMoves: 12
    }
  ];

  let currentLevelIdx = 0;

  while (currentLevelIdx < ROUTING_LEVELS.length) {
    const level = ROUTING_LEVELS[currentLevelIdx];
    let levelSolved = false;

    while (!levelSolved) {
      console.clear();
      try {
        const ascii = figlet.textSync('PACKET ROUTER', { font: 'Standard', horizontalLayout: 'fitted' });
        console.log(chalk.white.bold(ascii));
      } catch (e) {
        console.log(chalk.bold('NETWORK UTILITY: PACKET ROUTER'));
      }
      console.log(chalk.dim('─'.repeat(50)));
      console.log(`  Level ${currentLevelIdx + 1}: ${chalk.white.bold(level.name)}`);
      console.log(`  Goal: Route packet ${chalk.green('●')} from ${chalk.dim('[S]')} to ${chalk.white.bold('[D]')}.`);
      console.log(`  Constraints: Avoid firewalls ${chalk.gray('[■]')}. Max moves: ${chalk.white.bold(level.maxMoves)}.`);
      console.log(chalk.dim('─'.repeat(50)));
      console.log('');

      // Print the initial grid
      renderGrid(level, level.start, []);
      console.log('');

      const pathInput = await prompt({
        message: 'Enter routing path (e.g. RRDDRR, keys: U/D/L/R) or type "exit":',
        validate: (val) => {
          const clean = val.trim().toUpperCase();
          if (clean === 'EXIT') return true;
          return /^[UDLR]+$/.test(clean) || 'Path must contain only U, D, L, R characters.';
        }
      });

      const pathStr = pathInput.trim().toUpperCase();
      if (pathStr === 'EXIT') {
        return;
      }

      // Animate the path
      const steps = pathStr.split('');
      let currentPos = [...level.start];
      const trail = [];
      let crashed = false;
      let crashReason = '';

      for (let i = 0; i <= steps.length; i++) {
        // Render step
        console.clear();
        try {
          const ascii = figlet.textSync('PACKET ROUTER', { font: 'Standard', horizontalLayout: 'fitted' });
          console.log(chalk.white.bold(ascii));
        } catch (e) {
          console.log(chalk.bold('NETWORK UTILITY: PACKET ROUTER'));
        }
        console.log(chalk.dim('─'.repeat(50)));
        console.log(`  Routing Packet... Step ${i}/${steps.length}`);
        console.log(chalk.dim('─'.repeat(50)));
        console.log('');

        // Render the grid with trail and current position
        renderGrid(level, currentPos, trail, crashed);
        console.log('');

        if (crashed) {
          console.log(chalk.red(`  ✗ Packet Lost: ${crashReason}`));
          console.log('');
          await new Promise(r => setTimeout(r, 2500));
          break;
        }

        // Check if reached destination at the end of the input path
        if (currentPos[0] === level.end[0] && currentPos[1] === level.end[1]) {
          if (steps.length > level.maxMoves) {
            crashed = true;
            crashReason = `Buffer Overflow (Max moves is ${level.maxMoves}, path had ${steps.length}).`;
            // Force redraw on next iteration to show crash
            i--; // back up step counter so the end is shown
            continue;
          }
          levelSolved = true;
          console.log(chalk.green('  ✓ Packet successfully routed to destination!'));
          console.log('');
          await new Promise(r => setTimeout(r, 2000));
          break;
        }

        // If we processed all steps but did not reach destination
        if (i === steps.length) {
          crashed = true;
          crashReason = 'Connection Timed Out (Did not reach destination).';
          // Force redraw on next iteration to show crash
          i--;
          continue;
        }

        // Process next step direction
        const step = steps[i];
        trail.push([...currentPos]);
        if (step === 'U') currentPos[0]--;
        else if (step === 'D') currentPos[0]++;
        else if (step === 'L') currentPos[1]--;
        else if (step === 'R') currentPos[1]++;

        // Check boundary
        if (currentPos[0] < 0 || currentPos[0] >= level.size || currentPos[1] < 0 || currentPos[1] >= level.size) {
          crashed = true;
          crashReason = 'Out of Bounds (Packet sent out of network range).';
        }

        // Check firewall collision
        if (!crashed) {
          const isFirewall = level.firewalls.some(fw => fw[0] === currentPos[0] && fw[1] === currentPos[1]);
          if (isFirewall) {
            crashed = true;
            crashReason = 'Collision (Packet vaporized by firewall).';
          }
        }

        await new Promise(r => setTimeout(r, 250));
      }

      if (levelSolved) {
        currentLevelIdx++;
      }
    }
  }

  // Victory Screen
  console.clear();
  try {
    const ascii = figlet.textSync('ACCESS GRANTED', { font: 'Standard', horizontalLayout: 'fitted' });
    console.log(chalk.green.bold(ascii));
  } catch (e) {
    console.log(chalk.green.bold('CORE ROUTER UNLOCKED'));
  }
  console.log(chalk.dim('─'.repeat(50)));
  console.log(`${chalk.bold('System Status:')}  Optimal Packet Flow Restored`);
  console.log(`${chalk.bold('Network Link:')}   Active & Secure`);
  console.log(chalk.dim('─'.repeat(50)));
  console.log(chalk.dim.italic('  "The lines of communication are open. Excellent work."'));
  console.log('');
  await new Promise(r => setTimeout(r, 4000));
  console.clear();
}

/**
 * Helper to render the network grid
 */
function renderGrid(level, currentPos, trail, crashed) {
  const { size, start, end, firewalls } = level;
  
  for (let r = 0; r < size; r++) {
    let rowStr = '  ';
    for (let c = 0; c < size; c++) {
      const isCurrent = currentPos[0] === r && currentPos[1] === c;
      const isStart = start[0] === r && start[1] === c;
      const isEnd = end[0] === r && end[1] === c;
      const isFirewall = firewalls.some(fw => fw[0] === r && fw[1] === c);
      const isTrail = trail.some(t => t[0] === r && t[1] === c);

      if (isCurrent) {
        rowStr += crashed ? chalk.red.bold('[💥]') : chalk.green.bold('[●]');
      } else if (isEnd) {
        rowStr += chalk.white.bold('[D]');
      } else if (isStart) {
        rowStr += chalk.dim('[S]');
      } else if (isFirewall) {
        rowStr += chalk.gray('[■]');
      } else if (isTrail) {
        rowStr += chalk.green('[·]');
      } else {
        rowStr += chalk.dim('[·]');
      }
      rowStr += ' ';
    }
    console.log(rowStr);
  }
}

/**
 * CYBER DEFUSE
 * Logic gates puzzle.
 */
async function startDefuseGame() {
  const levels = [
    {
      num: 1,
      inputs: { A: 0, B: 1 },
      target: 1,
      evaluate: (inp) => (inp.A && inp.B) ? 1 : 0,
      render: (inp) => `
  [A] (${inp.A}) ───\\__[ AND ]─── [OUT]
  [B] (${inp.B}) ───/
`
    },
    {
      num: 2,
      inputs: { A: 0, B: 0, C: 1 },
      target: 0,
      evaluate: (inp) => ((inp.A || inp.B) ^ inp.C) ? 1 : 0,
      render: (inp) => `
  [A] (${inp.A}) ───\\__[ OR  ]─── [X] ───\\__[ XOR ]─── [OUT]
  [B] (${inp.B}) ───/                     /
  [C] (${inp.C}) ────────────────────────/
`
    },
    {
      num: 3,
      inputs: { A: 0, B: 1, C: 0 },
      target: 1,
      evaluate: (inp) => ((!(inp.A ^ inp.B)) && inp.C) ? 1 : 0,
      render: (inp) => `
  [A] (${inp.A}) ───\\__[ XOR ]─── [NOT] ─── [X] ───\\__[ AND ]─── [OUT]
  [B] (${inp.B}) ───/                               /
  [C] (${inp.C}) ──────────────────────────────────/
`
    }
  ];

  let currentLevelIdx = 0;

  while (currentLevelIdx < levels.length) {
    const lvl = levels[currentLevelIdx];
    let levelSolved = false;
    let inputsState = { ...lvl.inputs };

    while (!levelSolved) {
      console.clear();
      try {
        const ascii = figlet.textSync('CYBER DEFUSE', { font: 'Standard', horizontalLayout: 'fitted' });
        console.log(chalk.white.bold(ascii));
      } catch (e) {
        console.log(chalk.bold('SECURITY CORE: CYBER DEFUSE'));
      }
      console.log(chalk.dim('─'.repeat(50)));
      console.log(`  Level ${lvl.num}: Logic Overload`);
      console.log(`  Goal: Modify inputs to make output match the Target.`);
      console.log(`  Target Output: ${chalk.green.bold(lvl.target)}`);
      console.log(chalk.dim('─'.repeat(50)));
      console.log('');

      // Display the schematic
      console.log(lvl.render(inputsState));
      console.log('');

      // Show current evaluation
      const currentOut = lvl.evaluate(inputsState);
      console.log(`  Current Output State: ${currentOut === lvl.target ? chalk.green.bold(currentOut) : chalk.red(currentOut)}`);
      console.log(chalk.dim('─'.repeat(50)));
      console.log('');

      const choices = Object.keys(inputsState).map(k => ({
        name: `Toggle Switch ${k} (Current: ${inputsState[k]})`,
        value: k
      }));
      choices.push(new Separator('─'.repeat(30)));
      choices.push({ name: '⚡ DEFUSE CIRCUIT', value: 'DEFUSE' });
      choices.push({ name: 'Exit Defusal Utility', value: 'EXIT' });

      const action = await select({
        message: 'Action:',
        choices
      });

      if (action === 'EXIT') {
        return;
      }

      if (action === 'DEFUSE') {
        if (currentOut === lvl.target) {
          levelSolved = true;
          console.log(chalk.green('\n  ✓ Logic match verified. Circuit safe.'));
          console.log('');
          await new Promise(r => setTimeout(r, 2000));
        } else {
          console.clear();
          console.log(chalk.red.bold('\n  💥💥💥 BOOM! 💥💥💥'));
          console.log(chalk.red('  Defusal validation failed. The security core exploded.'));
          console.log('');
          await new Promise(r => setTimeout(r, 3000));
          break; // restart level
        }
      } else {
        // Toggle input
        inputsState[action] = inputsState[action] === 1 ? 0 : 1;
      }
    }

    if (levelSolved) {
      currentLevelIdx++;
    }
  }

  if (currentLevelIdx === levels.length) {
    console.clear();
    try {
      const ascii = figlet.textSync('DEFUSED', { font: 'Standard', horizontalLayout: 'fitted' });
      console.log(chalk.green.bold(ascii));
    } catch (e) {
      console.log(chalk.green.bold('CIRCUIT SECURED'));
    }
    console.log(chalk.dim('─'.repeat(50)));
    console.log(`  ${chalk.bold('Status:')}       Security Core Defused`);
    console.log(`  ${chalk.bold('Auth Code:')}   0xDEADBEEF`);
    console.log(chalk.dim('─'.repeat(50)));
    console.log(chalk.dim.italic('  "Crisis averted. System firewall is now fully responsive."'));
    console.log('');
    await new Promise(r => setTimeout(r, 4000));
  }
}

/**
 * DOCKER SCALE
 * Turn-based DevOps simulator.
 */
async function startDockerGame() {
  const waves = [
    { num: 1, load: 200 },
    { num: 2, load: 500 },
    { num: 3, load: 800 },
    { num: 4, load: 400 },
    { num: 5, load: 1000 }
  ];

  let currentWaveIdx = 0;
  let latencyPenalty = 0;

  let containers = {
    web: 0,
    api: 0,
    db: 0
  };

  const CPU_LIMIT = 4.0;
  const RAM_LIMIT = 8.0;

  while (currentWaveIdx < waves.length) {
    const wave = waves[currentWaveIdx];
    let waveDone = false;
    let tempContainers = { ...containers };

    while (!waveDone) {
      const cpuUsed = tempContainers.web * 0.5 + tempContainers.api * 1.0 + tempContainers.db * 1.5;
      const ramUsed = tempContainers.web * 1.0 + tempContainers.api * 2.0 + tempContainers.db * 3.0;
      const capacity = tempContainers.web * 100 + tempContainers.api * 200 + tempContainers.db * 500;

      console.clear();
      try {
        const ascii = figlet.textSync('DOCKER SCALE', { font: 'Standard', horizontalLayout: 'fitted' });
        console.log(chalk.white.bold(ascii));
      } catch (e) {
        console.log(chalk.bold('DEVOPS PORT: DOCKER SCALE'));
      }
      console.log(chalk.dim('─'.repeat(50)));
      console.log(`  Traffic Wave ${wave.num}/${waves.length}`);
      console.log(`  Incoming Traffic:  ${chalk.cyan(`${wave.load} req/s`)}`);
      console.log(`  Your capacity:     ${capacity >= wave.load ? chalk.green(`${capacity} req/s`) : chalk.yellow(`${capacity} req/s`)}`);
      console.log(`  System Latency:    ${latencyPenalty > 50 ? chalk.red(`${latencyPenalty}%`) : chalk.gray(`${latencyPenalty}%`)}`);
      console.log(chalk.dim('─'.repeat(50)));

      const cpuPercentage = cpuUsed / CPU_LIMIT;
      const ramPercentage = ramUsed / RAM_LIMIT;
      
      const cpuFilled = Math.min(10, Math.max(0, Math.round(cpuPercentage * 10)));
      const cpuBar = '■'.repeat(cpuFilled) + '□'.repeat(10 - cpuFilled);

      const ramFilled = Math.min(10, Math.max(0, Math.round(ramPercentage * 10)));
      const ramBar = '■'.repeat(ramFilled) + '□'.repeat(10 - ramFilled);

      const cpuColor = cpuUsed > CPU_LIMIT ? chalk.red : chalk.white;
      const ramColor = ramUsed > RAM_LIMIT ? chalk.red : chalk.white;

      console.log(`  CPU Limit: [ ${cpuColor(cpuBar)} ] ${cpuColor(`${cpuUsed.toFixed(1)} / ${CPU_LIMIT.toFixed(1)} Cores`)}`);
      console.log(`  RAM Limit: [ ${ramColor(ramBar)} ] ${ramColor(`${ramUsed.toFixed(1)} / ${RAM_LIMIT.toFixed(1)} GB`)}`);
      console.log(chalk.dim('─'.repeat(50)));
      console.log('');
      console.log('  Container counts:');
      console.log(`    web (serves 100 req/s, 0.5 CPU, 1.0GB RAM): ${chalk.bold(tempContainers.web)}`);
      console.log(`    api (serves 200 req/s, 1.0 CPU, 2.0GB RAM): ${chalk.bold(tempContainers.api)}`);
      console.log(`    db  (serves 500 req/s, 1.5 CPU, 3.0GB RAM): ${chalk.bold(tempContainers.db)}`);
      console.log('');

      if (cpuUsed > CPU_LIMIT || ramUsed > RAM_LIMIT) {
        console.log(chalk.red.bold('  ⚠️  RESOURCE OVERLOAD DETECTED!'));
        console.log(chalk.red('  Scaling violates node capacity bounds. Scaling actions blocked.'));
        console.log('');
      }

      const actions = [
        { name: 'Scale web (+1)', value: 'web_up' },
        { name: 'Scale web (-1)', value: 'web_down', disabled: tempContainers.web === 0 },
        { name: 'Scale api (+1)', value: 'api_up' },
        { name: 'Scale api (-1)', value: 'api_down', disabled: tempContainers.api === 0 },
        { name: 'Scale db  (+1)', value: 'db_up' },
        { name: 'Scale db  (-1)', value: 'db_down', disabled: tempContainers.db === 0 },
        new Separator('─'.repeat(30)),
        { name: '⚡ COMMIT CHANGES & SIMULATE WAVE', value: 'COMMIT', disabled: cpuUsed > CPU_LIMIT || ramUsed > RAM_LIMIT },
        { name: 'Exit DevOps Simulator', value: 'EXIT' }
      ];

      const action = await select({
        message: 'Deployment Command:',
        choices: actions
      });

      if (action === 'EXIT') {
        return;
      }

      if (action === 'COMMIT') {
        containers = { ...tempContainers };
        
        console.clear();
        console.log(chalk.dim('  Deploying container orchestration configs...'));
        await new Promise(r => setTimeout(r, 1000));

        if (capacity < wave.load) {
          const shortage = wave.load - capacity;
          const penalty = Math.round((shortage / wave.load) * 40);
          latencyPenalty += penalty;
          console.log(chalk.yellow(`\n  ⚠️  Capacity Shortage! Server overloaded.`));
          console.log(chalk.yellow(`     Latency increased by +${penalty}% due to dropped requests.`));
        } else {
          latencyPenalty = Math.max(0, latencyPenalty - 15);
          console.log(chalk.green(`\n  ✓ Load fully served! Latency recovered.`));
        }

        console.log('');
        await new Promise(r => setTimeout(r, 2500));

        if (latencyPenalty >= 100) {
          console.clear();
          console.log(chalk.red.bold('\n  💥💥💥 SERVICE DOWN 💥💥💥'));
          console.log(chalk.red('  Latency penalty hit 100%. Node completely locked due to load spikes.'));
          console.log('');
          await new Promise(r => setTimeout(r, 3000));
          return;
        }

        waveDone = true;
      } else {
        const [service, direction] = action.split('_');
        if (direction === 'up') {
          tempContainers[service]++;
        } else {
          tempContainers[service] = Math.max(0, tempContainers[service] - 1);
        }
      }
    }

    currentWaveIdx++;
  }

  console.clear();
  try {
    const ascii = figlet.textSync('SYSTEM RUNNING', { font: 'Standard', horizontalLayout: 'fitted' });
    console.log(chalk.green.bold(ascii));
  } catch (e) {
    console.log(chalk.green.bold('INFRASTRUCTURE ONLINE'));
  }
  console.log(chalk.dim('─'.repeat(50)));
  console.log(`  ${chalk.bold('Orchestrator:')}  Active & Balanced`);
  console.log(`  ${chalk.bold('Wave Status:')}   All 5 waves handled successfully`);
  console.log(chalk.dim('─'.repeat(50)));
  console.log(chalk.dim.italic('  "99.99% uptime target achieved. Kubernetes would be proud."'));
  console.log('');
  await new Promise(r => setTimeout(r, 4000));
}

/**
 * DNS LOOKUP
 * Network subnetting speedrun.
 */
async function startSubnetGame() {
  const levels = [
    { num: 1, type: 'mask', desc: 'Calculate the Subnet Mask' },
    { num: 2, type: 'netid', desc: 'Calculate the Network Address (NetID)' },
    { num: 3, type: 'broadcast', desc: 'Calculate the Broadcast Address' }
  ];

  let currentLevelIdx = 0;
  let attempts = 3;

  function intToIp(num) {
    return [
      (num >>> 24) & 0xff,
      (num >>> 16) & 0xff,
      (num >>> 8) & 0xff,
      num & 0xff
    ].join('.');
  }

  while (currentLevelIdx < levels.length && attempts > 0) {
    const lvl = levels[currentLevelIdx];
    
    const isClassC = Math.random() > 0.5;
    const ipParts = isClassC 
      ? [192, 168, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1]
      : [172, Math.floor(Math.random() * 16) + 16, Math.floor(Math.random() * 254) + 1, Math.floor(Math.random() * 254) + 1];
    
    const ipStr = ipParts.join('.');
    const cidr = isClassC 
      ? Math.floor(Math.random() * 6) + 24 
      : Math.floor(Math.random() * 6) + 18; 

    const ipInt = ipParts.reduce((acc, octet) => (acc << 8) + octet, 0) >>> 0;
    const maskInt = (cidr === 32 ? 0xffffffff : (0xffffffff << (32 - cidr))) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const broadInt = (ipInt | ~maskInt) >>> 0;

    let correctAnswer = '';
    if (lvl.type === 'mask') {
      correctAnswer = intToIp(maskInt);
    } else if (lvl.type === 'netid') {
      correctAnswer = intToIp(netInt);
    } else if (lvl.type === 'broadcast') {
      correctAnswer = intToIp(broadInt);
    }

    console.clear();
    try {
      const ascii = figlet.textSync('DNS LOOKUP', { font: 'Standard', horizontalLayout: 'fitted' });
      console.log(chalk.white.bold(ascii));
    } catch (e) {
      console.log(chalk.bold('NETWORK CHALLENGE: DNS LOOKUP'));
    }
    console.log(chalk.dim('─'.repeat(50)));
    console.log(`  Level ${lvl.num}: ${lvl.desc}`);
    console.log(`  Network Node:  ${chalk.cyan(`${ipStr} /${cidr}`)}`);
    console.log(`  Lives Left:    ${'♥ '.repeat(attempts)}`);
    console.log(chalk.dim('─'.repeat(50)));
    console.log('');

    const answer = await prompt({
      message: 'Enter IP address answer:',
      validate: (val) => {
        const clean = val.trim();
        if (clean.toUpperCase() === 'EXIT') return true;
        return /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(clean) || 'Must be a valid IPv4 address (X.X.X.X).';
      }
    });

    const cleanAnswer = answer.trim();
    if (cleanAnswer.toUpperCase() === 'EXIT') {
      return;
    }

    if (cleanAnswer === correctAnswer) {
      console.log(chalk.green('\n  ✓ Correct answer! Router tables updated.'));
      console.log('');
      await new Promise(r => setTimeout(r, 2000));
      currentLevelIdx++;
    } else {
      attempts--;
      console.log(chalk.red(`\n  ✗ Incorrect! The correct answer was: ${correctAnswer}`));
      console.log('');
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  if (attempts === 0) {
    console.clear();
    console.log(chalk.red.bold('\n  ✗ CONNECTION TIMEOUT'));
    console.log(chalk.red('  All attempts exhausted. Subnet configuration failed.'));
    console.log('');
    await new Promise(r => setTimeout(r, 3000));
  } else {
    console.clear();
    try {
      const ascii = figlet.textSync('RESOLVED', { font: 'Standard', horizontalLayout: 'fitted' });
      console.log(chalk.green.bold(ascii));
    } catch (e) {
      console.log(chalk.green.bold('ROUTING RESOLVED'));
    }
    console.log(chalk.dim('─'.repeat(50)));
    console.log(`  ${chalk.bold('Status:')}       Domain Name System Verified`);
    console.log(`  ${chalk.bold('Latency:')}      0.1 ms (Perfect match)`);
    console.log(chalk.dim('─'.repeat(50)));
    console.log(chalk.dim.italic('  "Subnet route propagation verified. DNS tables updated."'));
    console.log('');
    await new Promise(r => setTimeout(r, 4000));
  }
}

function displayLogo(name) {
  console.log('');
  try {
    // Render the first name in standard font with fitted layout for visual excellence
    const firstName = name.split(' ')[0];
    const ascii = figlet.textSync(firstName.toUpperCase(), { font: 'Standard', horizontalLayout: 'fitted' });
    console.log(chalk.white.bold(ascii));
  } catch (e) {
    console.log(chalk.white.bold(name.toUpperCase()));
  }
  console.log(chalk.dim('Developer API Portfolio'));
  console.log(chalk.dim('─'.repeat(50)));
}

async function fetchAPI(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function startInteractiveMode() {
  console.log(chalk.dim('▲ Connecting to portfolio API...'));
  const spinner = ora({
    text: 'Fetching developer profile metadata',
    color: 'white'
  }).start();
  
  const [me, projects, contact, experience] = await Promise.all([
    fetchAPI('/me'),
    fetchAPI('/projects'),
    fetchAPI('/contact'),
    fetchAPI('/experience')
  ]);

  if (!me) {
    spinner.fail(chalk.red(`Connection failed to ${BASE_URL}`));
    console.log(chalk.dim('  Please check if the local server is running or if you have internet access.'));
    process.exit(1);
  }
  
  spinner.succeed(chalk.gray('Connection established'));
  
  displayLogo(me.name || 'Prasanna');

  let exitMenu = false;

  while (!exitMenu) {
    const action = await select({
      message: 'Explore:',
      choices: [
        { name: 'about      Identity profile and capabilities', value: 'about' },
        { name: 'projects   Curated software repository', value: 'projects' },
        { name: 'experience Professional work history', value: 'experience' },
        { name: 'contact    Email & social links', value: 'contact' },
        { name: 'games      Interactive terminal challenges', value: 'games' },
        new Separator('─'.repeat(40)),
        { name: 'exit       Close interactive session', value: 'exit' },
      ],
    });

    console.log(''); // spacer

    if (action === 'games') {
      let backToMain = false;
      while (!backToMain) {
        console.clear();
        try {
          const ascii = figlet.textSync('PLAYGROUND', { font: 'Standard', horizontalLayout: 'fitted' });
          console.log(chalk.white.bold(ascii));
        } catch (e) {
          console.log(chalk.bold('TERMINAL GAMES'));
        }
        console.log(chalk.dim('─'.repeat(50)));
        console.log('  Select a challenge to verify system capabilities:');
        console.log(chalk.dim('─'.repeat(50)));
        console.log('');

        const gameChoice = await select({
          message: 'Select Game:',
          choices: [
            { name: 'breach     Firewall code-breaking challenge', value: 'breach' },
            { name: 'routing    Packet routing network puzzle', value: 'routing' },
            { name: 'defuse     Circuit logical defusal puzzle', value: 'defuse' },
            { name: 'scale      Docker DevOps container scaling', value: 'scale' },
            { name: 'subnet     DNS lookup IP subnet math challenge', value: 'subnet' },
            new Separator('─'.repeat(40)),
            { name: 'back       Return to main menu', value: 'back' }
          ]
        });

        if (gameChoice === 'breach') {
          await startBreach();
        } else if (gameChoice === 'routing') {
          await startRoutingGame();
        } else if (gameChoice === 'defuse') {
          await startDefuseGame();
        } else if (gameChoice === 'scale') {
          await startDockerGame();
        } else if (gameChoice === 'subnet') {
          await startSubnetGame();
        } else if (gameChoice === 'back') {
          backToMain = true;
        }
      }
      displayLogo(me.name || 'Prasanna');
    }

    if (action === 'about') {
      console.log(chalk.bold('ABOUT ME'));
      console.log(chalk.dim('─'.repeat(50)));
      console.log(`${chalk.bold('Title:')}     ${me.title}`);
      console.log(`${chalk.bold('Location:')}  ${me.location}`);
      console.log(`${chalk.bold('Status:')}    ${me.openToWork ? chalk.green('● Open to Opportunities') : chalk.gray('● Unavailable')}`);
      console.log('');
      console.log(me.bio);
      console.log('');
      console.log(chalk.bold('CORE CAPABILITIES'));
      console.log(chalk.dim('─'.repeat(50)));
      
      // Print skills in chunked rows for readability
      const chunkSize = 4;
      for (let i = 0; i < me.skills.length; i += chunkSize) {
        const chunk = me.skills.slice(i, i + chunkSize);
        console.log(chalk.gray('  ' + chunk.join('  •  ')));
      }
      console.log(chalk.dim('─'.repeat(50)));
    }

    if (action === 'projects') {
      console.log(chalk.bold('FEATURED PROJECTS'));
      console.log(chalk.dim('─'.repeat(50)));
      if (projects && projects.length) {
        projects.slice(0, 3).forEach((p) => {
          console.log(`${chalk.bold.white(p.name)}`);
          console.log(`  ${p.description}`);
          console.log(`  ${chalk.dim('Code:')} ${chalk.underline.blue(p.url)}`);
          if (p.live) {
            console.log(`  ${chalk.dim('Live:')} ${chalk.underline.blue(p.live)}`);
          }
          console.log('');
        });
      } else {
        console.log(chalk.italic('  No projects found.'));
      }
      console.log(chalk.dim('─'.repeat(50)));
    }

    if (action === 'experience') {
      console.log(chalk.bold('CAREER ROADMAP'));
      console.log(chalk.dim('─'.repeat(50)));
      if (experience && experience.length) {
        experience.forEach((exp) => {
          console.log(`${chalk.bold(exp.role)} ${chalk.dim('@')} ${chalk.bold.white(exp.company)}`);
          console.log(chalk.gray(`  ${exp.period}`));
          console.log(`  ${exp.description}`);
          console.log('');
        });
      } else {
        console.log(chalk.italic('  No experience found.'));
      }
      console.log(chalk.dim('─'.repeat(50)));
    }

    if (action === 'contact') {
      console.log(chalk.bold('PING ME'));
      console.log(chalk.dim('─'.repeat(50)));
      const labels = {
        email: 'Email',
        github: 'GitHub',
        twitter: 'Twitter',
        linkedin: 'LinkedIn'
      };
      Object.entries(contact).forEach(([key, val]) => {
        if (val && labels[key]) {
          console.log(`  ${chalk.bold(labels[key].padEnd(10))} ${chalk.blue(val)}`);
        }
      });
      console.log(chalk.dim('─'.repeat(50)));
    }

    if (action === 'exit') {
      console.log(chalk.dim('API Reference:     ') + chalk.underline.blue(`${BASE_URL}/docs`));
      console.log(chalk.dim('Portfolio Website: ') + chalk.underline.blue('https://prasanna19.xyz'));
      console.log(chalk.gray('Session closed. See you around.'));
      console.log('');
      exitMenu = true;
    } else {
      console.log('');
      if (action !== 'breach') {
        await new Promise(r => setTimeout(r, 800));
        console.log(chalk.dim('─'.repeat(50)));
      }
    }
  }
}

process.on('SIGINT', () => {
  console.log('\n');
  console.log(chalk.dim('─'.repeat(50)));
  console.log(chalk.red('▲ Connection Terminated'));
  console.log(chalk.dim('  Session closed. See you around.'));
  console.log(chalk.dim('  Visit the GUI portfolio: ') + chalk.underline.blue('https://prasanna19.xyz'));
  console.log(chalk.dim('─'.repeat(50)));
  console.log('');
  process.exit(0);
});

startInteractiveMode().catch((err) => {
  if (err.message && (err.message.includes('force closed') || err.message.includes('SIGINT'))) {
    console.log('\n');
    console.log(chalk.dim('─'.repeat(50)));
    console.log(chalk.red('▲ Connection Terminated'));
    console.log(chalk.dim('  Session closed. See you around.'));
    console.log(chalk.dim('  Visit the GUI portfolio: ') + chalk.underline.blue('https://prasanna19.xyz'));
    console.log(chalk.dim('─'.repeat(50)));
    console.log('');
    process.exit(0);
  }
  console.error(chalk.red('\nAn unexpected error occurred:'), err.message);
  process.exit(1);
});
