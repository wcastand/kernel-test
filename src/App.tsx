import React, { useState, useEffect, useMemo } from 'react'
import create from 'zustand'
import produce from 'immer'
import { tw, apply } from 'twind'
import { css } from 'twind/css'

type Episode = {
	id: number
	name: string
	air_date: string
	director: string
	writer: string
	characters: string[]
	img_url: string
}

type Character = {
	id: number
	name: string
	status: string
	species: string
	gender: string
	hair: string
	origin: string
	abilities: string[]
	alias: string[]
	img_url: string
}

type State = {
	episodes: Episode[]
	characters: Map<number, Character>
	limit: number
	done: boolean
	load: (episodes: Episode[], characters: Character[]) => void
	more: () => void
}

const useStore = create<State>((set) => ({
	episodes: [],
	characters: new Map(),
	limit: 6,
	done: false,
	load: (episodes: Episode[], characters: Character[]) =>
		set(
			produce<State>((state) => {
				const charactersMap = new Map()
				characters.map((c) => charactersMap.set(c.id, c))

				state.episodes = episodes
				state.characters = charactersMap
			})
		),
	more: () =>
		set(
			produce<State>((state) => {
				if (state.limit < state.episodes.length) state.limit = state.limit + 6
				if (state.limit > state.episodes.length) state.done = true
			})
		),
}))

const container = apply`px-12 py-4 grid grid-cols-1 gap-4 justify-center`
const item = apply`flex flex-row border rounded-sm`
const show_img = apply(
	`h-full w-32 object-cover mr-4`,
	css`
		min-height: 4rem;
	`
)
const show_info = apply`flex-1 py-4`
const character_list_container = apply(
	`py-4 pr-4 flex flex-row flex-wrap gap-1 justify-end items-start`,
	css`
		max-width: 16rem;
	`
)
const character_list_img = apply`h-8 w-8 object-cover rounded-sm border-1`
const btn = apply`px-4 py-1 m-auto border-1 rounded hover:(bg-gray-900 text-white) disabled:(text-gray-900 bg-white cursor-not-allowed) transition-colors`

function getCharacterIndex(url: string): number {
	return parseInt(url.split('character/')[1], 10)
}

const CharacterList: React.FC<{ episodename: string; characters: Character[] }> = ({ episodename, characters }) => {
	return (
		<div className={tw(character_list_container)}>
			{characters.map((character) => (
				<img
					key={`${episodename}_image_${character.id}`}
					className={tw(character_list_img)}
					src={character.img_url}
					alt={character.name}
					title={character.name}
				/>
			))}
		</div>
	)
}

const Item: React.FC<{ episode: Episode; characters: Map<number, Character> }> = ({ episode, characters }) => {
	const charactersList = useMemo<Character[]>(() => episode.characters.map((c) => characters.get(getCharacterIndex(c))!), [episode])
	return (
		<li key={episode.id} className={tw(item)}>
			<img className={tw(show_img)} src={episode.img_url} alt={`image of episode ${episode.name}`} title={episode.name} />
			<div className={tw(show_info)}>
				<p className={tw(`text-xl text-gray-900`)}>{episode.name}</p>
				<p className={tw(`text-sm text-gray-400`)}>{new Date(episode.air_date).toLocaleDateString('en-GB')}</p>
			</div>
			<CharacterList episodename={episode.name} characters={charactersList} />
		</li>
	)
}

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
