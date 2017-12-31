# Emoji Favicon Toolkit

This code won't work on pages that don't include the script until browsers change how their ServiceWorker implementations handle favicons.

## Usage

Include `<script src="/emoji-favicon-toolkit.js"/>`

### Static usage

    <link rel="icon" type="text/plain" href="data:,🍔" sizes="any"/>

### API usage

    set_emoji_favicon(emoji="", cacheWithServiceWorker=false)

