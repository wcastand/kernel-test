import { css } from 'twind/css'
import { tw, apply } from 'twind'
import React, { useMemo } from 'react'

import { Episode, Character } from './store'

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

export const Item: React.FC<{ episode: Episode; characters: Map<number, Character> }> = ({ episode, characters }) => {
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

export default Item
