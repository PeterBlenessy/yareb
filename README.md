# yareb - Yet Another React Electron Boilerplate

## Intro

On my path to obtaining some hands-on practical experience in DevOps, I decided to kill two birds with one stone, and decided to learn how to build cross platform applications using Electron and React while I'm at it. This README documents my learning path and the repo reflects the outcome. Since the end result is essentially Yet Another React Electron Boilerplate, I decided to call it just that - yareb.

I will be covering the below steps:

- [x] [Step 1 - Setting up the development environment](#step-1---setting-up-the-development-environment)
- [x] [Step 2 - Bootstrapping a React Application](#step-2---bootstrapping-a-react-application)
- [x] [Step 3 - Setting up Electron](#step-3---setting-up-electron)
- [x] [Step 4 - Packaging the application](#step-4---packaging-the-application)
- [x] [Step 5 - Publishing the application](#step-5---publishing-the-application)
- [x] [Step 6 - Setting up Code Signing](#step-6---setting-up-code-signing)
- [x] [Step 7 - Setting up automatic updates](#step-7---setting-up-automatic-updates)
- [x] [Step 8 - Setting up automated testing](#step-8---setting-up-automated-testing)
- [x] [Step 9 - Setting up analytics](#step-9---setting-up-analytics)
- [ ] [Step 10 - Customizing the application](#step-10---customizing-the-application)

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

Install electron as a developer dependency:

```bash
$ npm i -D electron
```

Modify `package.json` file so that the main entry points to `main.js` file:

```json
{
  "main": "main.js",
  "homepage": ".",
}
```

Change  `"scripts":` section in `package.json` file

```json
{
  "scripts": {
    "serve": "react-scripts start",
    "start": "electron ."
  }
}
```

Create the `main.js` file based on a minimal template:

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

Verify that the application builds and runs fine:

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

## Step 4 - Packaging the application

So now we have a simple application, which can be run outside of a web browser, as expected. Next up is to set up packaging so we can distribute it.

Since I'm a mac user, the primary focus will be on packaging for macOS. I will cover Linux and Windows as well in some detail, but will not set up local environments for verifying on those platforms. I plan to cover verification on Linux and Window at a later step, when covering CI/CD and test automation. I figure, that GitHub has support for this already, either via Docker or by using VMs, so, at least in theory, I feel pretty confident that I can leave it for now.

### 4.1 Preparing for packaging by installing [electron-builder](https://www.electron.build/) as a developer dependency:

Quoting from their website, electron-builder is:

> A complete solution to package and build a ready for distribution Electron app for macOS, Windows and Linux with “auto update” support out of the box.

So let's run:

```bash
$ npm i -D electron-builder
```

### 4.2 Packaging for macOS

We need to modify the `package.json` file and add macos build option:

```json
{
  ...
  "scripts": {
    ...
    "build:macos": "electron-builder --macos --dir"
    ...
  }
  ...
}
```

#### 4.2.1 Setting up a development build

Running `npm run build:macos` will create a standard macOS executable called `yareb.app` and put it in the `dist/mac` folder.

```bash
$ npm run build:macos
```

Although I expected this step to be straight forward, I ran into some problems and, after some warnings, the command exited with an error:

>  Application entry file "build/electron.js" in the "/Users/peter/Development/electron-projects/yareb/dist/mac/yareb.app/Contents/Resources/app.asar" does not exist. Seems like a wrong configuration.

The first warning is referring to the same problem and it also gives us a hint on where to look for help:

> public/electron.js not found. Please see https://medium.com/@kitze/%EF%B8%8F-from-react-to-an-electron-app-ready-for-production-a0468ecb1da3

Reading the referenced article, I learned that the configuration created by create-react-app (CRA) has some expectations, e.g. on having an `electron.js` file in the `public` folder insted the `main.js` file we've created in the root folder of our project.

>We’re adding it in the “public” folder instead of “src” so it can get copied to the “build” folder as it is. This is needed for the production version, and it’s explained later.

I don't really like this solution since the article is quite old, written June 13, 2017, but trying out the solution it seemed to fix the build problem, so I'm sticking to it for now and will investigate further at a later step. The article discussed some other configuration options as well, e.g. how to start the app during development in a convenient way, which I might bring into the project in the next step.

So here are the suggested changes:

From within Visual Studio Code, I simply moved `main.js` to the `public`folder and renamed it to  `electron.js`. Probably not the best way to do it from a git perspective, but I didn't give it a lot of thought.

```json
{
  ...
  "main": "public/electron.js",
  "homepage": "./",
  ...
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

#### 4.2.2 Setting up a production build

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

## Step 5 - Publishing the application

Publishing the application is a rather straight forward step.

We need to install `electron-updater`and make some changes to `package.json` and `public/electron.js` files.

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

As a word of caution, don't share your GH_TOKEN with anyone and don't upload it to GitHub.

In the releases section of your GitHub repository you will now be able to see the new DRAFT release, in my case 0.1.0 release. The release does not have a tag set yet since we have not published it yet. This is done by editing the release when we feel ready for release, add the tag you want to use for the release and press the "Publish release" button. In my case, I have also checked the checkbox "This is a pre-release" since I'd like to cover som more steps in this project before I can call the "application" production ready.

This finalizes this step and it's time to push our changes code to GitHub.

## Step 6 - Setting up Code Signing

> Starting with MacOS 10.14.5, all signed applications by ‘new’ developers will need to be notarized or they will trigger Apple’s Gatekeeper software and prevent users from installing your app. That means that aside from signing your application, you will need to notarize it as well. This is how to successfully notarize your Electron application.

The process to a successfuly signed installer is:

1. Setup an Apple Developer Program account
2. Sign the application with a valid Apple Developer ID
3. Notarize the signed application
4. Package the app into a `dmg` (which is NOT signed and NOT noterized!)

### 6.1 - Setting up an Apple Developer Program account

For this to work on OSX, the application has to be signed and notarized. To do that, I need to set up an Apple developer account and generate certificates. The Apple Developer Program account takes a few days to get enrolled,  but when it's done, certificates can be generated either from the web site of from within Xcode. I will not dive further into this topic, but refer to the below links for more details.

- [ElectronBuilder - Code Signing](https://www.electron.build/code-signing)
- [Manage signing certificates](https://help.apple.com/xcode/mac/current/#/dev154b28f09)

I have followed the steps in the above articles and have listed them below.

### 6.2 - Signing the application

Assuming that the Apple Developer ID is set up, remove `-c.mac.identity=null` from `"build:macos"` and `"dist:macos"` to configure `electron-builder` to attempt to sign the application.

```json
{
  "scripts": {
    ...
    "dist:macos": "electron-builder --macos",
    ...
  }
}
```

Run:

```bash
$ npm run dist:macos
```

This gives us an additional print out in the terminal:

```bash
 • signing         file=dist/mac/yareb.app identityName=Developer ID Application: <...> identityHash=<...> provisioningProfile=none
```

You can check that the application signing is successful by running:

```bash
$ codesign -dv --verbose=4 /PathToApp/yareb.app
```

#### 6.3 - Notarizing the application

Several articles describe in detail the process of noterization also providing source code for the implementation.

- [Notarizing your Electron application](https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/).
- [Notarize Electron apps on Mac OS automatically with electron-builder & electron-notarize](https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db)

I decided to however to use the `electron-builder-noterize` module since it implements notarization as suggested by the above sources and allows me to have less own source code to maintain in the repo. See [electron-builder-notarize](https://www.npmjs.com/package/electron-builder-notarize) for more details.

We add the required modules as developer dependencies:

```bash
$ npm i -D electron-notarize
$ npm i -D electron-builder-notarize
```

Following the module description page and the other two articles, we update the configuration for `"mac"` for `electron-builder` in the `package.json` file to

- use [Hardened Runtime](https://developer.apple.com/documentation/security/hardened_runtime)
- avoid assessing that signing was successful
- use the entitlements from `electron-builder-noterize` module

```json
{
  "mac": {
    ...
    "hardenedRuntime" : true,
    "gatekeeperAssess": false,
    "entitlements": "./node_modules/electron-builder-notarize/entitlements.mac.plist",
    ...
  },
  "afterSign": "electron-builder-notarize",
  ...
}
```

Now we run `npm run dist:macos` to execute all of the steps needed to create a **distributable dmg installer image**, i.e. *build*, *sign*, *notarize* and *packaging* the app.

```bash
$ npm run dist:macos
...
Notarizing com.electron.boilerplates.yareb found at /Users/peter/Development/electron-projects/yareb/dist/mac/yareb.app
Done notarizing com.electron.boilerplates.yareb
```

You may run into the below error:

```bash
Error: Failed to upload app to Apple's notarization servers
xcrun: error: unable to find utility "altool", not a developer tool or in PATH
```

To fix it, run:

```bash
$ sudo xcode-select -r
```

>Unsets  any  user-specified developer directory, so that the developer directory will be found via the default search mechanism. This command must be run  with  superuser  permissions  (see sudo(8)), and will affect all users on the system.

This concludes this step of the learning process. It has been the one with the longest lead time so far due to the Apple Developer Program account setup.

As a last step before we push our changes to GitHub, we also verify that signing and notarization works also when publishing the application. We update `package.json` with `"version": "0.6.0"` to align with the learning step section headings and run:

```bash
$ GH_TOKEN=<your_github_token> npm run publish:github
```

It looks all good, the new release appears on GitHub, the DMG can be installed and the application opened with a message that Apple has scanned its contents for malisious code and found none. So I go ahead and push the changes to GitHub.

## Step 7 - Setting up automatic updates

Closing the loop started in [Step 5 - Publishing the application](#step-5---publishing-the-application) by finalizing [Step 6 - Setting up Code Signing](#step-6---setting-up-code-signing) I was expecting to be able to update an installed version of the app automatically when a newer version was published to GitHub.

I was wrong.

It took some searching to realize that `electron-updater` is expecting a `zip` target to be available when checking for updates and I only configured `dmg` as target in the `package.json` file when building and packaging for `mac`. If I had skipped configuring specific targets and just went with the defaults which include `zip` as target, I would have succeeded without realizing this quite important detail, so it is actually a win for me - more learning.

So, after updating `package.json` with the below I got the much anticipated update notification and the new version of the app.

```json
{
  ...
  "version": "0.6.4",
  ...
  "build": {
    ...
    "mac": {
      ...
      "target": [
        "zip",
        "dmg"
      ]
  ...
  }
}
```
I also updated the title of the application window to `Yet Another React Electron Boilerplate` as it should be.

So time to increase the version to 0.7.0 and push the changes to GitHub.


## Step 8 - Setting up automated testing

When using `create-react-app` to generate the initial code for our app, as we did, a besic level of testing is setup for us. The test code is available in the file `src/App.test.js` and it basically is a check that the _learn react_ link is rendered in the UI. The script for testing is added in the `package.json` file.

```json
{
  ...
  "scripts": {
    ...
    "test": "react-scripts test"
  }
  ...
}
```

To run it:

```bash
$ npm run test
```

Tests are being run in _watch mode_, meaning that they get are re-run autommatically every time we save our changes to the code. This is nice.

To print also a `code coverage` report, run:

```bash
$ npm run test -- --coverage
```

### Test framework used by Create React App

> Create React App uses Jest as its test runner. To prepare for this integration, we did a major revamp of Jest so if you heard bad things about it years ago, give it another try.
>
> Jest is a Node-based runner. This means that the tests always run in a Node environment and not in a real browser. This lets us enable fast iteration speed and prevent flakiness.

Read more about the test setup that comes with Create React App [here](https://create-react-app.dev/docs/running-tests/).

### Component testing

I did not intend to write any additional tests at this point as the purpose with this section was to see how testing was set up and how to use it.

But, while reading the documentation at CRA i found the section regarding [Testing Components](https://create-react-app.dev/docs/running-tests/#testing-components) rather interesting. It gives good advice regarding how to extend the tests based on the purpose.

>There is a broad spectrum of component testing techniques. They range from a “smoke test” verifying that a component renders without throwing, to shallow rendering and testing some of the output, to full rendering and testing component lifecycle and state changes.

So I decided to try out the technique called `shallow rendering` which CRA recommends using to test components in isolation from the child components they render.

Install some additional packages:

```bash
$ npm install --save enzyme enzyme-adapter-react-16 react-test-renderer
```

Configure the adapter in `src/setupTests.js` file.

```javascript
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
```

Add a smoke test to `src/App.test.js` file.

```javascript
import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  shallow(<App />);
});
```

Another option to testing components is to use the `React Testing Library`.

>As an alternative or companion to enzyme, you may consider using react-testing-library. react-testing-library is a library for testing React components in a way that resembles the way the components are used by end users. It is well suited for unit, integration, and end-to-end testing of React components and applications. It works more directly with DOM nodes, and therefore it's recommended to use with jest-dom for improved assertions.

At this point however, I am quite happy with what I've learned and will not dig into any more details. 

### Setting up a continuous integration (CI) workflow using GitHub Actions

So far, we have focused on running the tests locally. The next step is to run it on GitHub whenever we push code to the repository. For this, we set up a CI workflow using [GitHub Actions](https://help.github.com/en/actions) on [GitHub-hosted runners](https://help.github.com/en/actions/reference/virtual-environments-for-github-hosted-runners).

In the root folder of the project, run:

```bash
$ mkdir -p ".github/workflows" && touch ".github/workflows/ci.yml"
```

Then copy the contents of [node.js.yml](https://github.com/actions/starter-workflows/blob/master/ci/node.js.yml) to our `ci.yml` file.

Following the description on [Using Node.js with GitHub Actions](https://help.github.com/en/actions/language-and-framework-guides/using-nodejs-with-github-actions) we end up with the contents in our `ci.yml` file.

Read more about [continuous integration (CI)](https://help.github.com/en/actions/building-and-testing-code-with-continuous-integration/about-continuous-integration).

So now, let's push the latest changes to GitHub and see if the workflow we set up for GitHub Actions works as planned.

## Step 9 - Setting up analytics

I decided to try out [Nucleus](https://nucleus.sh/electron) for application analytics. I've been working with Google Analytics before and there is quite som overhead to start and Nucleus seemed pretty straight forward and simple, which is sufficient for the purpose of this project.

>**analytics** and **bug tracking** for Electron apps
>Cross-platform and real-time with bug reports and offline tracking. As simple as including the Node module.

After signing up for a free starter account, I get presented with instructions on how to get started.

Install the Nucleus module as a dependency in our project.

```bash
# Add the Nucleus module to your project
$ npm install --save nucleus-nodejs
```

Update `public/electron.js` to import the Nucleus module and initialize it with the app ID we got when registering and creating a new app at Nucleus.

```javascript
// Import it and init with your app ID
const Nucleus = require('nucleus-nodejs')
Nucleus.init('5ec1855e48ae1100ea8d8389')
```

Add the below to the `createWindow` function.

```javascript
// Once everything in your app is fully loaded, call the appStarted() method
Nucleus.appStarted()
```

Add any other relevant custom event.

```javascript
// Report events and actions
Nucleus.track('BUTTON_CLICKED')
```

With this we are done and running the application generates statistics in the Nucleus dashboard.

### Privacy considerations

It is important to inform the user about what data is being collected and perhaps offer a way to opt out. This is important due to GDPR.

Informing the users can be as in this example from Nucleus:
>To get information about the devices and behavior of our users, we use Nucleus to provide analytics. This service gives us insight about how users interact with our software. It does not store any personal identifiable information. Visit their [transparency](https://www.nucleus.sh/transparency) page to get the full list of data they collect.

In order to keep it simple for this project, I added the above privacy notice in `scr/App.js`, so it will be visible directly. In a production grade application, this should be handled in a more sofisticated manner.

Opt out can be solved by allowing the users to `enableTracking()` and `disableTracking()`.

>Provide the option to your users to disable/enable tracking as they wish.
>Nucleus' modules support doing that with the `enableTracking()` and `disableTracking()` modules.

For a full list of what data is collected and what is not, see the [Nucleus data transparency page](https://www.nucleus.sh/transparency).

## Step 10 - Customizing the application

With the previous step finalized, I can tick off the DevOps part of this project. The boilerplate is now prepared for creating an application ready for building, automatic testing, signing, notarizing, publishing, and updating to newer versions, and also for collecting usage data which we can address in a new release. Some steps cannot be automated, such as creating accounts, but there are good guides for these.

What remains now is to check out some ways to customize the application boilerplate. I am thinking of things such as adding system tray support, customizing or at least hiding the out-of-the-box Electron system menu, adding support for a React component library to simplify UI development, and actually making use of this in the application.

### 10.1 - System tray support

We make the below changes to our `public/electron.js` file.

```javascript
const { app, BrowserWindow, Menu, Tray } = require('electron');

...

let tray;

function createTray() {
  const iconPath = path.join(__dirname, "logo16.png");
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      type: 'normal',
      click() {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Yet Another React Electron Boilerplate');
  tray.setContextMenu(contextMenu);
}

...

app.on('ready', () => {
  createTray();
  createWindow();
});

```

Add the `logo16.png` file which will be the system tray icon. I simply resized `public/logo512.png` to be 16x16 pixels and stored it in the same folder.

The only thing this system tray menu can do now is to show a tool tip and a menu for quiting the app.

### 10.2 - Customizing the system menu

Hiding the default system menu can be done by calling.

```javascript
Menu.setApplicationMenu(null);
```

Customizing it requires some more code.

```javascript

function createMainMenu() {
  const template = [
    {
      label: 'My menu',
      submenu: [
        {
          label: 'Hello',
          click() {
            console.log('Hello world!');
          }
        },
        {
          type: 'separator',
        },
        {
          label: 'Toggle developer tools',
          role: 'toggleDevTools'
        },
        {
          label: 'About',
          role: 'about'
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          role: 'quit',
        }    
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

...

app.on('ready', () => {
  createTray();
  createWindow();
  createMainMenu();
});

```

It is generally a good idea to keep the code clean and to do that, we could break out menu handling to it's own file.

### 10.3 - Using a component library

I chose to go with the [Blueprint](https://blueprintjs.com/)
> A REACT-based UI toolkit for the web 

Run

```bash
# Install the Blueprint core packages
$ npm install --save @blueprintjs/core

# Install typings for Blueprint's dependencies
$ npm install --save @types/react @types/react-dom
```

Update `src/index.css` with:

```javascript
@import '~normalize.css';
@import '~@blueprintjs/core/lib/css/blueprint.css';
@import '~@blueprintjs/icons/lib/css/blueprint-icons.css';
```

#### 10.3.1 - Adding a navigation bar

Update `src/App.js`
```javascript
import React from 'react';
import { Navbar, Button, Alignment } from '@blueprintjs/core';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar className="bp3-dark">
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Blueprint</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="home" text="Home" />
          <Button className="bp3-minimal" icon="document" text="Files" />
          <span class="bp3-navbar-divider"></span>
          <button class="bp3-button bp3-minimal bp3-icon-user"></button>
          <button class="bp3-button bp3-minimal bp3-icon-notifications"></button>
          <button class="bp3-button bp3-minimal bp3-icon-cog"></button>
        </Navbar.Group>
      </Navbar>

...
```


For the record, I also bumped up versions for some of the dependencies to get rid of some vulnerabilities found by `npm audit` and `npm outdated`.


