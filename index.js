#!/usr/bin/env node

const path = require('path')
const Anvil = require('prismarine-provider-anvil').Anvil('1.15')

const {
	sourceX,
	sourceZ,
	sourceWidth,
	sourceHeight,
	targetX,
	targetZ,
	targetWorld,
	sourceWorld,
} = require('yargs').argv

const sourceRegionPath = path.join(sourceWorld, 'region')
const targetRegionPath = path.join(targetWorld, 'region')
const source = new Anvil(sourceRegionPath)
const target = new Anvil(targetRegionPath)

const chunksToCopy = Array.from({ length: sourceWidth }, (_, x) =>
	Array.from({ length: sourceHeight }, (_, z) => ({
		x: x + sourceX,
		z: z + sourceZ,
	})),
).flat()

async function main() {
	await Promise.all(
		chunksToCopy.map(async ({ x, z }) => {
			const chunk = await source.loadRaw(x, z)

			const zPos = chunk.value.Level.value.zPos.value
			const xPos = chunk.value.Level.value.xPos.value
			const targetZPos = zPos - sourceZ + targetZ
			const targetXPos = xPos - sourceX + targetX
			chunk.value.Level.value.zPos.value = targetZPos
			chunk.value.Level.value.xPos.value = targetXPos

			await target.saveRaw(targetXPos, targetZPos, chunk)
		}),
	)
}

main().catch(console.error)
