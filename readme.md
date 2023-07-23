<img align="right" width="300" src="https://user-images.githubusercontent.com/631757/94169395-a7a67c00-fe86-11ea-802f-e13b5c3b3572.png" alt="screenshot of merged minecraft world map">

# unmaintained, does not work in minecraft 1.17 onwards

sorry

# minecraft world splicer

move a section of a minecraft world into another, entities and all

## install

[nodejs](https://nodejs.org/) v12 is required. run:

```
npm install -g minecraft-world-splicer
```

## usage

```
minecraft-world-splicer \
  --source-world=path/to/source-world \
  --source-x=0 --source-z=0 \
  --source-width=1 --source-height=1 \
  --target-world=path/to/target-world \
  --target-x=0 -target-z=0
```

| option | description |
|-|-|
| `--source-world` | the world to copy chunks from |
| `--source-x` `--source-z` | chunk coordinates (**not** block coordinates) in the source world to copy from |
| `--source-width` `--source-height` | how many chunks to copy |
| `--target-world` | world to copy chunks into. its world generation and inventories will be kept. any chunks overlapping with the copied chunks **will be overwritten** |
| `--target-x` `-target-z` | chunk coordinates in the target world to copy to. the point corresponding to the source coordinates will be copied to this point. |

## please for miku's sake make a backup

this tool has been tested somewhat but it **will** overwrite chunks in the target world without prompting and it **might** corrupt your world.

## thanks

to [@rowanmanning](https://github.com/rowanmanning) for testing and moral support and the [Prismarine project](https://github.com/prismarinejs/) for already having done the hard bits

## licence

ISC, &copy; Kara Brightwell
