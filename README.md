# yareb - Yet Another React Electron Boilerplate

## Intro

On my path to obtaining some hands-on practical experience in DevOps, I decided to kill two birds with one stone, and decided to learn how to build cross platform applications using Electron and React while I'm at it. This README documents my learning path and the repo reflects the outcome. Since the end result is essentially Yet Another React Electron Boilerplate, I decided to call it just that - yareb.

I will be covering the below steps:

- [x] [Step  1 - Setting up the development environment](#step-1)
- [x] [Step  2 - Bootstrapping a React Application](#step-2)
- [x] [Step  3 - Setting up Electron](#step-3)
- [x] [Step  4 - Packaging the application](#step-4)
- [ ] Step  5 - Publishing the application
- [ ] Step  6 - Setting up automatic updates
- [ ] Step  7 - Setting up automated testing
- [ ] Step  8 - Setting up analytics
- [ ] Step  9 - Adding system tray support
- [ ] Step 10 - Customising the applicationß

Since the Internet brought you here, I hope that you find some of this information and code useful.

## Step 1 - Setting up the development environment {#step-1}

First things first, you got to have `Node.js` and `npm` installed and this is a good place to start: [Download and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Then install your favorite IDE, I use [Visual Studio Code](https://code.visualstudio.com/).

Finally, I also created this GitHub repository.

## Step 2 - Bootstrapping a React Application {#step-2}

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

## Step 3 - Setting up Electron {#step-3}

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

## Step4 - Packaging the application {#step-4}

So now we have a simple application, which can be run outside of a web browser, as expected. Next up is to set up packaging so we can distribute it.

Since I'm a mac user, the primary focus will be on packaging for macOS. I will cover Linux and Windows as well in some detail, but will not set up local environments for verifying on those platforms. I plan to cover verification on Linux and Window at a later step, when covering CI/CD and test automation. I figure, that GitHub has support for this already, either via Docker or by using VMs, so, at least in theory, I feel pretty confident that I can leave it for now.

### Preparing for packaging by installing [electron-builder](https://www.electron.build/) as a developer dependency:

Quoting from their website, electron-builder is:

> A complete solution to package and build a ready for distribution Electron app for macOS, Windows and Linux with “auto update” support out of the box.

So let's run:

```bash
$ npm i -D electron-builder
```

### Packaging for macOS

We need to modify the `package.json` file and add macos build option:

```json
{
  "scripts": {
    "build:macos": "electron-builder --macos --dir"
  }
}
```

#### Setting up a development build

Running `npm run build:macos` will create a standard macOS executable called `yareb.app` and put it in the `dist/mac` folder.

```bash
$ npm run build:macos
```

Although I expected this step to be straight forward, I ran into some problems and, after some warnings, the command exited with an error:

>  Application entry file "build/electron.js" in the "/Users/peter/Development/electron-projects/yareb/dist/mac/yareb.app/Contents/Resources/app.asar" does not exist. Seems like a wrong configuration.

The first warning is referring to the same problem and it also gives us a hint on where to look for help:

> public/electron.js not found. Please see https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3

Reading the referenced article, I learned that the configuration created by create-react-app (CRA) has some expectations, e.g. on having an `electron.js` file in the `public`folder insted the `main.js` file we've created in the root folder of our project.

>We’re adding it in the “public” folder instead of “src” so it can get copied to the “build” folder as it is. This is needed for the production version, and it’s explained later.

I don't really like this solution since the article is quite old, written June 13, 2017, but trying out the solution it seemed to fix the build problem, so I'm sticking to it for now and will investigate further at a later step. The article discussed some other configuration options as well, e.g. how to start the app during development in a convenient way, which I might bring into the project in the next step.

So here are the suggested changes:

From whithin Visual Studio Code, I simply moved `main.js` to the `public`folder and renamed it to  `electron.js`. Probably not the best way to do it from a git perspective, but I didn't give it a lot of thought.

```json
{
  "main": "public/electron.js",
  "homepage": "./",
}
```

Running `npm run build:macos` will now give us a successful build with some minor warnings.

```bash
 • description is missed in the package.json  appPackageFile=/Users/peter/Development/electron-projects/yareb/package.json
 • author is missed in the package.json  appPackageFile=/Users/peter/Development/electron-projects/yareb/package.json
 • default Electron icon is used  reason=application icon is not set
 • skipped macOS application code signing  reason=cannot find valid "Developer ID Application" identity or custom non-Apple code signing certificate, see https://electron.build/code-signing allIdentities=
```

The first two were fixed by modifying the `package.json` file:

```json
{
  "description": "Yet Another React Electron Boilerplate",
  "author": "Peter Blenessy"
}
```

We will leave the third warning for now and cover this in one of the comming steps when we focus on configuring assets.

The last warning about macOS application signing required to explicitely set `-c.mac.identity=null` for the `build:macos`in the `package.json` file. A real solution for this is also postponed at this point to an upcomming step focusing on how to get the application into the App Store.

The workaround for now is:
```json
{
  "build:macos": "electron-builder --macos -c.mac.identity=null",
}
```

Here is the final output:

```bash
  • electron-builder  version=22.5.1 os=19.4.0
  • loaded configuration  file=package.json ("build" field)
  • loaded parent configuration  preset=react-cra
  • writing effective config  file=dist/builder-effective-config.yaml
  • rebuilding native dependencies  dependencies=fsevents@1.2.12, fsevents@1.2.12, fsevents@1.2.12 platform=darwin arch=x64
  • packaging       platform=darwin arch=x64 electron=8.2.3 appOutDir=dist/mac
  • default Electron icon is used  reason=application icon is not set
  • skipped macOS code signing  reason=identity explicitly is set to null
```

#### Setting up a production build

To set up a production build we need to modify the `package.json` file:

```json
{
  "dist:macos": "electron-builder --macos -c.mac.identity=null",
}
```

And we also add some configuration options to `electron-builder` to specify how we want our distribution build to be done.

```json
{
  "build": {
    "productName": "yareb",
    "appId": "com.electron.boilerplates.yareb",
    "mac": {
      "artifactName": "${productName}-${version}-osx.${ext}",
      "category": "your.app.category.type",
      "target": [
        "dmg"
      ]
    }
  }
}
```

Running `npm run dist:macos` will take slightly longer time than the previous development build and create among other files `yareb-0.1.0.dmg`, a standard macOS installer and put it in the `dist/` folder:

```bash
$ npm run dist:macos
```

Here is the final output:

```bash
  • electron-builder  version=22.5.1 os=19.4.0
  • loaded configuration  file=package.json ("build" field)
  • loaded parent configuration  preset=react-cra
  • writing effective config  file=dist/builder-effective-config.yaml
  • rebuilding native dependencies  dependencies=fsevents@1.2.12, fsevents@1.2.12, fsevents@1.2.12 platform=darwin arch=x64
  • packaging       platform=darwin arch=x64 electron=8.2.3 appOutDir=dist/mac
  • default Electron icon is used  reason=application icon is not set
  • skipped macOS code signing  reason=identity explicitly is set to null
  • building        target=DMG arch=x64 file=dist/yareb-0.1.0-osx.dmg
  • building block map  blockMapFile=dist/yareb-0.1.0.dmg.blockmap
```

We are now ready with building and packaging a distributable artifact on macOS. Let's push our changes to GitHub and prepare for the next step, which is publishing.

Further configuration of the packaging output can be done as described at: https://www.electron.build/configuration/dmg, but we are OK for now.

## Step  5 - Publishing the application {#step-5}

Publishing the application is a rather straight forward step.

We need to install `electron-updater`and make somre changes to `package.json` and `public/electron.js` files.

```bash
# Install electron-updater
$ npm i electron-updater
```

Updates in `package.json`:

```json
{

  "scripts": {
    ...
    "publish:github": "electron-builder --macos -p always".
    ...
  }

// Make changes to "build":
  "build": {
    ...
    "publish": {
      "provider": "github",
      "owner": "PeterBlenessy",
      "repo": "yareb"
    }
  }
}
```

Updates in `electron.js`:

```javascript
// Import electron-updater
const { autoUpdater } = require('electron-updater');

...

function createWindow() {
  ...
  
  win.loadURL(...)

  // Check for updates 
  autoUpdater.checkForUpdatesAndNotify();
  ...
}
```

In order to be able to upload the candidate package to GitHub for publishing we need to generate a GitHub token which we will use when running the publish script.

  Check out the following links to learn more about how to get started with GitHub `tokens`.
  - https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line
  - https://github.com/settings/tokens/new

  ```bash
  $ GH_TOKEN=<use-your-gh_token-here> npm run publish:github
  ```

As a word of caution, don't share your GH_TOKEN with anyone and donät upload it to GitHub.

In the releases section of your GitHub repository you will now be able to see the new DRAFT release, in my case 0.1.0 release. The release does not have a tag set yet since we have not published it yet. This is done by editing the release when we feel ready for release, add the tag you want to use for the release and press the "Publish release" button. In my case, I have also checked the checkbox "This is a pre-release" since I'd like to cover som more steps in this project before I can call the "application" production ready.

This finalizes this step and it's time to push our changes code to GitHub.




