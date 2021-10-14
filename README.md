# Stump.js
Stump.js gives you more control of the data logged to the console. You can easily toggle debug messages and verbose messages on and off, as well as locate error messages faster.

## Code example
Code:
![Code example](https://media.discordapp.net/attachments/898047385211637790/898047393205981234/unknown.png)
Output:
![Output example](https://cdn.discordapp.com/attachments/898047385211637790/898047932505399337/unknown.png)

## Logging to a Discord webhook
Setting up a Discord channel with a webhook is a great way to save logs in a searchable format for free.

Code:
![Code example](https://cdn.discordapp.com/attachments/898047385211637790/898048539547037706/unknown.png)
Output:
![Output example](https://cdn.discordapp.com/attachments/898047385211637790/898048753402011698/unknown.png)

## Usage
The `Stump` class is invoked with two arguments: features and settings. The `Debug` feature enables the `debug` and `verbose` log messages. The `Discord` feature enables posting to a Discord webhook and requires the `webhook` parameter in the settings object.

### Logging methods:

 - `.info()`
 - `.success()`
 - `.warn()`
 - `.error()`
 - `.verbose()`
 - `.debug()`