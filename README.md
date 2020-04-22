# yareb - Yet Another React Electron Boilerplate

## Intro

On my path to obtaining some hands-on practical experience in DevOps, I decided to kill two birds with one stone, and decided to learn how to build cross platform applications using Electron and React while I'm at it. This README documents my learning path and the repo reflects the outcome. Since the end result is essentially Yet Another React Electron Boilerplate, I decided to call it just that - yareb. 

Since the Internet brought you here, I hope that you find some of this information and code useful.

## Step 1 - Setting up the development environment

First things first, you got to have `Node.js` and `npm` installed and this is a good place to start: [Download and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Then install your favorite IDE, I use [Visual Studio Code](https://code.visualstudio.com/).

Finally, I also created this GitHub repository.

## Step 2 - Bootstrapping a React Application

Now we're ready to create the very first application bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).

On the terminal, run:

```bash
$ npx create-react-app yareb
```

After about a minute of installing dependencies, we get a final message on the terminal saying `Happy hacking!` and we are ready to start our new React application by running:

```bash
$ cd yareb
$ yarn start
```

The `create-react-app` script creates folders and files according the structure defined for a newly bootstrapped Create React App project. It also comes with it's own README.md file which I have moved to `README.create-react-app.md` for reference.

Since the app starts and works as expected, we are ready to commit our changes to GitHub by running:

```bash
# List changes in the local repository not yet staged for commit.
$ git status

# Add the folders and files in the local repository and stage them for commit.
$ git add .

# Commit the tracked changes and prepares them to be pushed to a remote repository.
$ git commit -m "Step 2 - Bootstrapping a React Application - DONE"

# Verify the remote repository URL.
$ git remote -v

# Push the changes in the local repository up to the remote repository.
$ git push -u origin master
```

## Step 3 - Setting up Electron

### Install electron as a developer dependency:

```bash
$ npm i -D electron
```

### Modify package.json file so that the main entry points to main.js file:

```json
{
  "main": "main.js",
  "homepage": ".",
}
```
Change  `"scripts":` section in package.json file

```json
{
  "scripts": {
    "serve": "react-scripts start",
    "start": "electron ."
  }
}
```

### Create the `main.js` file based on a minimal template:

```javascript
const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });

  //win.loadFile('index.html');
  win.loadURL(`file://${__dirname}/build/index.html`);
  
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
```

### Verify that the application builds and runs fine:

```bash
# Build first to create the index.html file we set in main.js to be loaded when we run the Electron application.
$ npm run build

# Start the Electron application.
$ npm start
```

The application starts and behaves as expected, which takes us to the next commit to GitHub.

```bash
$ git status
$ git add .
$ git commit -m "Step 2 - Bootstrapping a React Application - DONE"
$ git remote -v
$ git push -u origin master
```