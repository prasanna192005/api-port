#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { select, Separator, input as prompt } from '@inquirer/prompts';
import figlet from 'figlet';
import gradient from 'gradient-string';

const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const BASE_URL = isLocal ? 'http://localhost:3000' : 'https://prasanna-api19.vercel.app';

/**
 * 🔐 THE BREACH (Hacker Mastermind)
 * A professional-grade CLI hacking simulation.
 */
async function startBreach() {
  const CODE_LENGTH = 4;
  const secret = Math.floor(Math.random() * Math.pow(10, CODE_LENGTH)).toString().padStart(CODE_LENGTH, '0');
  const attempts = 6;
  let currentAttempt = 0;
  let solved = false;

  console.clear();
  console.log(gradient.retro.multiline(figlet.textSync(' THE BREACH ', { font: 'Small' })));
  console.log(chalk.dim(' Firewall Strength: ') + chalk.yellow('MEDIUM') + chalk.dim(' | Encryption: ') + chalk.green('DECIMAL-SHIFT-9\n'));

  console.log(boxen(
    chalk.cyan(' INTRUSION DETECTED. SYSTEM SECURITY CHALLENGE INITIATED. ') + 
    chalk.dim(`\n Guess the ${CODE_LENGTH}-digit DECIMAL code to bypass the firewall. `) +
    chalk.dim('\n You have 6 attempts before permanent lockout. '),
    { padding: 1, borderStyle: 'double', borderColor: 'yellow' }
  ));

  while (currentAttempt < attempts && !solved) {
    const guess = await prompt({
      message: chalk.bold.green(` [Attempt ${currentAttempt + 1}/${attempts}] Enter ${CODE_LENGTH}-digit CODE: `),
      validate: (val) => new RegExp(`^[0-9]{${CODE_LENGTH}}$`).test(val) || `Entry must be a valid ${CODE_LENGTH}-digit Number.`
    });

    const upperGuess = guess.toUpperCase();
    currentAttempt++;

    if (upperGuess === secret) {
      solved = true;
      break;
    }

    // Mastermind Logic
    let correctSymbols = 0;
    let correctPositions = 0;
    const secretArr = secret.split('');
    const guessArr = upperGuess.split('');
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

    console.log(chalk.dim(' ├─ Analysis: ') + chalk.yellow(`${correctSymbols + correctPositions} correct symbols`) + 
                chalk.dim(' | ') + chalk.green(`${correctPositions} in correct positions\n`));
  }

  if (solved) {
    console.log(gradient.cristal('\n [ SUCCESS ] Firewalls bypassed. Accessing secure data protocols... '));
    await new Promise(r => setTimeout(r, 1000));
    console.log(boxen(
        chalk.bold.green(' ACCESS GRANTED ') + 
        chalk.dim('\n Welcome, Administrator. ') +
        chalk.dim('\n DECODED SECRET: ') + chalk.white.bold(secret) +
        chalk.dim('\n TIP: ') + chalk.italic(' "True power lies in the raw data, not the UI slop." '),
        { padding: 1, borderStyle: 'round', borderColor: 'green' }
    ));
  } else {
    console.log(chalk.red.bold('\n [ FAILURE ] Multiple failed attempts. Connection purged. '));
    console.log(chalk.dim(` The correct sequence was: `) + chalk.white.bold(secret));
  }

  await new Promise(r => setTimeout(r, 3000));
  console.clear();
}

// Helper to print animated ASCII logo
function displayLogo(text) {
  return new Promise((resolve) => {
    figlet(text, { font: 'Slant' }, (err, data) => {
      if (!err) {
        console.log(gradient.pastel.multiline(data));
      } else {
        console.log(chalk.cyan.bold(text));
      }
      console.log('\n');
      resolve();
    });
  });
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
  const spinner = ora('Waking up the API servers...').start();
  
  const [me, projects, contact, experience] = await Promise.all([
    fetchAPI('/me'),
    fetchAPI('/projects'),
    fetchAPI('/contact'),
    fetchAPI('/experience')
  ]);

  if (!me) {
    spinner.fail(chalk.red(`Server unreachable at ${BASE_URL}. Is it running?`));
    process.exit(1);
  }
  
  spinner.succeed(chalk.green('API Connected Successfully!\n'));
  
  await displayLogo(me.name || 'Prasanna');

  let exitMenu = false;

  while (!exitMenu) {
    const action = await select({
      message: 'What would you like to explore?',
      choices: [
        { name: '👤 About Me', value: 'about' },
        { name: '💻 Projects', value: 'projects' },
        { name: '💼 Experience', value: 'experience' },
        { name: '📨 Contact', value: 'contact' },
        { name: '🔐 The Breach (GAME)', value: 'breach' },
        new Separator(),
        { name: '🚪 Exit', value: 'exit' },
      ],
    });

    console.log(''); // spacer

    if (action === 'breach') {
      await startBreach();
    }

    if (action === 'about') {
      const output = [];
      output.push(chalk.bold.cyan(me.title));
      output.push(chalk.gray(me.location));
      output.push('');
      output.push(chalk.italic(me.bio));
      output.push('');
      output.push(chalk.bold.yellow('Skills: '));
      output.push('  ' + me.skills.map(s => chalk.blue(s)).join(' • '));
      
      console.log(boxen(output.join('\n'), {
        padding: 1, borderStyle: 'round', borderColor: 'cyan', title: ' Identity Params ', titleAlignment: 'center'
      }));
    }

    if (action === 'projects') {
      const output = [];
      if (projects && projects.length) {
        projects.slice(0, 3).forEach((p, idx) => {
          output.push(`${chalk.bold.magenta(`#${idx + 1} ${p.name}`)}`);
          output.push(`  ${chalk.gray(p.description)}`);
          output.push(`  [Code] ${chalk.cyan.underline(p.url)}`);
          if (p.live) output.push(`  [Live] ${chalk.cyan.underline(p.live)}`);
          output.push('');
        });
      } else {
        output.push(chalk.italic('No projects found.'));
      }
      
      console.log(boxen(output.join('\n').trim(), {
        padding: 1, borderStyle: 'round', borderColor: 'magenta', title: ' Top Repositories ', titleAlignment: 'center'
      }));
    }

    if (action === 'experience') {
      const output = [];
      if (experience && experience.length) {
        experience.forEach((exp, idx) => {
          output.push(`${chalk.bold.yellow(exp.role)} at ${chalk.bold.white(exp.company)}`);
          output.push(`${chalk.gray(exp.period)}`);
          output.push(`${exp.description}`);
          if (idx < experience.length - 1) output.push(chalk.dim('---'));
        });
      } else {
        output.push(chalk.italic('No experience found.'));
      }
      
      console.log(boxen(output.join('\n'), {
        padding: 1, borderStyle: 'round', borderColor: 'yellow', title: ' Career Path ', titleAlignment: 'center'
      }));
    }

    if (action === 'contact') {
      const output = [];
      if (contact.email) output.push(`  Email:    ${chalk.cyan(contact.email)}`);
      if (contact.github) output.push(`  GitHub:   ${chalk.cyan(contact.github)}`);
      if (contact.twitter) output.push(`  Twitter:  ${chalk.cyan(contact.twitter)}`);
      if (contact.linkedin) output.push(`  LinkedIn: ${chalk.cyan(contact.linkedin)}`);

      console.log(boxen(output.join('\n'), {
        padding: 1, borderStyle: 'round', borderColor: 'green', title: ' Ping Me ', titleAlignment: 'center'
      }));
    }

    if (action === 'exit') {
      console.log(chalk.gray(`\n  Explore the full REST API documentation at: `) + chalk.underline(`${BASE_URL}/docs`));
      console.log(chalk.magenta.bold('  Goodbye!\n'));
      exitMenu = true;
    } else {
      console.log('');
      // Small pause before returning to prompt
      if (action !== 'breach') await new Promise(r => setTimeout(r, 600));
    }
  }
}


startInteractiveMode().catch((err) => {
  console.error(chalk.red('\nAn unexpected error occurred:'), err.message);
  process.exit(1);
});
