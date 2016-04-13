# Documentation

This app has been developed to be a lightweight Electron app, demonstrating how to create a basic Electron app with a few exceptions that have been made for the sake of code organization in regards the the demos themselves.

All of the sample code shown in the app _is the actual code used in the app_. These JavaScript bits have been pulled out into their own file and organized by process (main or renderer) and then by section (communication, menus, native UI, printing, system, windows).

This was done for maintainability—code updates only have to be made in one place—and organization—it's easy to find the sample code you're looking for.

All of the pages (or views) are separate `.html` files which are appended onto the `index.html` using [HTML imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/).

## Folder Structure

![Diagram of App Structure and Operations](/assets/img/diagram.png)

#### `assets`
This directory contains assets for the app itself: CSS, fonts, images and shared JavaScript libraries or helpers.

#### `main-process`
This directory contains sub folders for each demo section that requires JavaScript in the main process. This structure is mirrored in the `renderer-process` directory.

The `main.js` file, located in the root, takes each `.js` file in these directories and executes them.

#### `renderer-process`
This directory contains sub folders for each demo section that requires JavaScript in the renderer process. This structure is mirrored in the `main-process` directory.

Each of the HTML page views requires the corresponding renderer-process `.js` files that it needs for its demo.

Each page view reads the content of its relevant main and renderer process files and adds them to the page for the snippets.

#### `sections`
This directory contains sub folders for each demo section. These subfolders contain the HTML files for each of the demo pages. Each of these files is appended to `index.html`, located at the root.

#### `index.html`
This is the main view in the app. It contains the sidebar with navigation and uses [HTML imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/) to append each section HTML page to the `body`.

#### `main.js`
This file contains the lifecycle instructions for the app like how to start and quit, it is the app's main process. It grabs every `.js` file in the `main-process` directory and executes.

The `package.json` sets this file as the `main` file.

#### `package.json`
This file is required when using `npm` and Electron.js. It contains details on the app: the author, dependencies, repository and points to `main.js` as the application's main process file.

#### Docs
The files: `CODE_OF_CONDUCT`, `README`, `docs` and `CONTRIBUTING` files make up the documentation for the project.

## UI Terminology

![UI Terminology](/assets/img/ui-terminology.png)

## CSS Naming Convention

Nothing too strict and used more as a guide:

- Styling elements directly should be avoided, but ok in some cases. Like `<p>` or `<code>`.
- Elements that belong together are prefixed with their parent class. `.section`, `.section-header`, `.section-icon`.
- States use `is-` prefix
- Utilities use `u-` prefix
