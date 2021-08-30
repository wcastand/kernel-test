import create from 'zustand'
import produce from 'immer'

export type Episode = {
	id: number
	name: string
	air_date: string
	director: string
	writer: string
	characters: string[]
	img_url: string
}

export type Character = {
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

export type State = {
	episodes: Episode[]
	characters: Map<number, Character>
	limit: number
	done: boolean
	load: (episodes: Episode[], characters: Character[]) => void
	more: () => void
}

export const useStore = create<State>((set) => ({
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

export default useStore
