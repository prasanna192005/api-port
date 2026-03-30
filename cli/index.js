#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { select, Separator } from '@inquirer/prompts';
import figlet from 'figlet';
import gradient from 'gradient-string';

const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const BASE_URL = isLocal ? 'http://localhost:3000' : 'https://prasanna-api19.vercel.app';

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
        new Separator(),
        { name: '🚪 Exit', value: 'exit' },
      ],
    });

    console.log(''); // spacer

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
      await new Promise(r => setTimeout(r, 600));
    }
  }
}

startInteractiveMode().catch((err) => {
  console.error(chalk.red('\nAn unexpected error occurred:'), err.message);
  process.exit(1);
});
