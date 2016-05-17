# Documentation

This app has been developed to be a lightweight Electron app, demonstrating how to create a basic Electron app with a few exceptions that have been made for the sake of code organization in regards to the demos themselves.

All of the sample code shown in the app _is the actual code used in the app_. These JavaScript bits have been pulled out into their own file and organized by process (main or renderer) and then by section (communication, menus, native UI, media, system, windows).

This was done for maintainability—code updates only have to be made in one place—and organization—it's easy to find the sample code you're looking for.

All of the pages (or views) are separate `.html` files which are appended onto the `index.html` using [HTML imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/).

Are you looking to add a demo? Jump to the [add a new demo section](#add-a-section-or-demo).

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

## Add a Section or Demo

Here are tips for covering the bases when adding a new section or demo. General tip—for some of these just copy the line or file of a similar existing item to get started!

### New Section

A whole new page with one or more demos.

#### index.html

This page contains the sidebar list of sections as well as each section template that is imported with HTML imports.

- Add demo to sidebar in the appropriate category in `index.html`
 - update `id` i.e. `id="button-dialogs"`
 - update `data-section` i.e. `data-section="dialogs"`
- Add demo template path to the import links in the `head` of `index.html`
 - i.e. `<link rel="import" href="sections/native-ui/dialogs.html">`

#### Template

This template is added to the `index.html` in the app.

- In the `sections` directory, copy an existing template `html` file from the category you're adding a section to.
- Update these tags `id`
 - i.e. `id="dialogs-section"`
- Update all the text in the `header` tag with text relevant to your new section.
 - Remove the demos and pro-tips as needed.

### Demo

Any code that you create for your demo should be added to the 'main-process' or 'renderer-process' directories depending on where it runs.

All JavaScript files within the 'main-process' directory are run when the app starts but you'll link to the file so that it is displayed within your demo (see below).

The renderer process code you add will be read and displayed within the demo and then required on the template page so that it runs in that process (see below).

- Start by copying and pasting an existing `<div class="demo">` blocks from the template page.
- Update the demo button `id`
 - i.e `<button class="demo-button" id="information-dialog">View Demo</button>`
- If demo includes a response written to the DOM, update that `id`, otherwise delete:
 - i.e. `<span class="demo-response" id="info-selection"></span>`
- Update the text describing your demo.
- If you are displaying main or renderer process sample code, include or remove that markup accordingly.
 - Sample code is read and added to the DOM by adding the path to the code in the `data-path`
   - i.e. `<pre><code data-path="renderer-process/native-ui/dialogs/information.js"></pre></code>`
 - Require your render process code in the script tag at the bottom of the template
   - i.e  `require('./renderer-process/native-ui/dialogs/information')`

#### Try it out

At this point you should be able to run the app, `npm start`, and see you section and/or demo. :tada:
