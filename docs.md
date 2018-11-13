# Документация

Это приложение было разработано как легкое приложение Electron, демонстрирующее, как создать базовое приложение Electron за несколькими исключениями, которые были сделаны ради организации кода в отношении самих демоверсий.

Весь образец кода, показанный в приложении, является _фактическим кодом, используемым в приложении_ Эти фрагменты JavaScript были извлечены из их собственных файлов иорганизованны в процессах (main или renderer) и разнесены по секциям (communication, menus, native UI, media, system, windows).

Это было сделано для обновления кода работоспособности, которое должно быть сделано только в одном месте - и организации - легко найти пример кода, который вы ищете.

Все страницы (или представления) представляют собой отдельные файлы .html, которые добавляются в `index.html`, используя [HTML imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/).

Вы хотите добавить демо? Перейти к [add a new demo section](#add-a-section-or-demo).

## Структура папок

![Схема структуры и операций приложения](/assets/img/diagram.png)

#### `assets`
Этот каталог содержит активы для самого приложения: CSS, fonts, images and shared JavaScript libraries or helpers.

#### `main-process`
Этот каталог содержит вспомогательные папки для каждой демонстрационной секции, для которой требуется JavaScript в основном процессе. Эта структура зеркалируется в каталоге `renderer-process`.

Файл `main.js` , расположенный в root, принимает каждый `.js` файл в этой папке и исполняет его.

#### `renderer-process`
Этот каталог содержит вспомогательные папки для каждой демонстрационной секции, для которой требуется JavaScript в процессе рендеринга. Эта структура зеркалируется в каталоге `main-process`.

Для каждого view представляемого HTML-страницей требуется соответствующий .js`-файл, который необходим для демонстрации.

Каждый page view считывает содержимое соответствующих файлов процессов main и renderer и добавляет их на страницу как снипеты.

#### `sections`
Этот каталог содержит вспомогательные папки для каждой демонстрационной секции. Эти подпапки содержат файлы HTML для каждой из демонстрационных страниц. Каждый из этих файлов добавляется к `index.html`, расположенному в корне.

#### `index.html`
Это главное view приложения. Он содержит боковую панель с навигацией и использует [HTML-импорт] (http://www.html5rocks.com/en/tutorials/webcomponents/imports/), чтобы добавить HTML-страницу каждого раздела в `body`.

#### `main.js`
Этот файл содержит инструкции по жизненному циклу для приложения, например, как начать и завершить работу, это основной процесс приложения. Он захватывает каждый файл `.js` в каталоге` main-process` и выполняется.

Файл `package.json` задает этот файл как `main` файл.

#### `package.json`
Этот файл требуется при использовании `npm` и Electron.js. Он содержит подробную информацию о приложении: автор, зависимости, репозиторий и указывает на `main.js` как основной файл процесса приложения.

#### Docs
Файлы: `CODE_OF_CONDUCT`, `README`, `docs` и `CONTRIBUTING` составляют документацию этого проекта.

## UI Терминология

![UI Terminology](/assets/img/ui-terminology.png)

## CSS Соглашение об именовании

Ничто не строго обязательно и больше используется в качестве руководства:

- Следует избегать прямой стилизации элементов, но в некоторых случаях это нормально. Как `<p>` или `<code>`.
- Элементы, которые принадлежат друг другу, имеют префикс их родительского класса. `.section`, `.section-header`, `.section-icon`.
- Состояни используют префикс `is-` 
- Утилиты используют префикс `u-` 

## Добавление секции или демо

Общий совет - для некоторых из них просто скопируйте строку или файл аналогичного существующего элемента, чтобы начать работу!

### Новая секция

Целая новая страница с одной или несколькими демонстрациями.

#### index.html

Эта страница содержит список секций боковой панели, а также каждый шаблон раздела, импортируемый с помощью импорта HTML.

- Добавьте демоверсию в боковую панель в соответствующей категории в `index.html`
 - обновите `id` т.e. `id="button-dialogs"`
 - обновите `data-section` т.e. `data-section="dialogs"`
- Добавьте демо template path к import links в `head` страницы `index.html`
 - т.e. `<link rel="import" href="sections/native-ui/dialogs.html">`

#### Шаблон

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

At this point you should be able to run the app, `npm start`, and see your section and/or demo. :tada:
