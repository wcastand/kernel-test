import React, { useEffect } from 'react'
import { tw, apply } from 'twind'

import useStore from './store'
import Item from './Item'

const container = apply`px-12 py-4 grid grid-cols-1 gap-4 justify-center`
const btn = apply`px-4 py-1 m-auto border-1 rounded hover:(bg-gray-900 text-white) disabled:(text-gray-900 bg-white cursor-not-allowed) transition-colors`

function App() {
	const { episodes, characters, limit, done, load, more } = useStore()

	async function init() {
		const characters = await fetch(`https://finalspaceapi.com/api/v0/character/?sort=asc`).then((res) => res.json())
		const episodes = await fetch(`https://finalspaceapi.com/api/v0/episode/?sort=asc`).then((res) => res.json())
		load(episodes, characters)
	}

	useEffect(() => {
		init()
	}, [])

	return (
		<React.Suspense fallback={'loading'}>
			<div className={tw(`flex flex-col justify-center my-12 gap-1`)}>
				<h1 className={tw`text-3xl font-bold text-center mb-4`}>Final Space's Episodes list</h1>
				<ul className={tw(container)}>
					{episodes.slice(0, limit).map((episode) => (
						<Item key={`episode_${episode.id}`} episode={episode} characters={characters} />
					))}
				</ul>
				<button className={tw(btn)} onClick={() => more()} disabled={done}>
					{done ? 'no episodes left' : 'load next episodes'}
				</button>
			</div>
		</React.Suspense>
	)
}

export default App
