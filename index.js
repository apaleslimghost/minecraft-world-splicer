#!/usr/bin/env node

const path = require('path')
const Komatsu = require('komatsu')
const Anvil = require('prismarine-provider-anvil').Anvil('1.15')

const logger = new Komatsu()

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

async function moveChunk({ from, to }) {
	const chunk = await source.loadRaw(from.x, from.z)
	chunk.value.Level.value.zPos.value = to.z
	chunk.value.Level.value.xPos.value = to.x

	const fromBlockX = from.x * 16
	const fromBlockZ = from.z * 16
	const toBlockX = to.x * 16
	const toBlockZ = to.z * 16

	const entities = chunk.value.Level.value.Entities.value

	if (entities.type === 'compound') {
		for (const entity of entities.value) {
			const [entityX, , entityZ] = entity.Pos.value.value
			entity.Pos.value.value[0] = entityX - fromBlockX + toBlockX
			entity.Pos.value.value[2] = entityZ - fromBlockZ + toBlockZ
		}
	}

	await target.saveRaw(to.x, to.z, chunk)
}

async function main() {
	await Promise.all(
		chunksToCopy.map(async (from) => {
			const to = {
				z: from.z - sourceZ + targetZ,
				x: from.x - sourceX + targetX,
			}

			await logger.logPromise(
				moveChunk({ from, to }),
				`moving source chunk ${from.x},${from.z} to target ${to.x},${to.z}`,
			)
		}),
	)
}

main().catch(console.error)
