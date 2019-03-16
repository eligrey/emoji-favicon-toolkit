# Emoji Favicon Toolkit

This code only works in browsers that support ServiceWorker favicons, such as Chrome 72+.

## Usage

1. Download [/dist/emoji-favicon-toolkit.js](https://raw.githubusercontent.com/eligrey/emoji-favicon-toolkit/master/dist/emoji-favicon-toolkit.js)
2. Include `<script src="/emoji-favicon-toolkit.js"/>`
3. Don't put it in a webpack or rollup.

### Static usage

    <link rel="icon" type="text/plain" href="data:;charset=utf-8,🍔" sizes="any"/>

### API usage

    set_emoji_favicon(emoji="", cacheWithServiceWorker=false)

