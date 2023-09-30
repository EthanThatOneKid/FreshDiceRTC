import { onEvent, signal } from '../client_deps.ts' 
import { on, fire } from '../client_deps.ts'  
import { DiceGame } from './diceGame.ts'

/** A type that describes a Player object. */
export type Player = {
    id: string
    idx: number
    playerName: string
    color: string
    score: number
    lastScore: string
}

const DEBUG = true

const MAXPLAYERS = 2

export let thisPlayer: Player = {
    id: "0",
    idx: 0,
    playerName: 'Player1',
    color: 'brown',
    score: 0,
    lastScore: ''
}

let game: DiceGame;

let thisColor = 'snow';

export const players: Set<Player> = new Set();

export const getCount =() => {
    return players.size;
}

export const init = (thisgame: DiceGame, color: string) => {
    game = thisgame
    thisColor = color 
    
    players.clear()

    // WebRTC disconnect - can only be peer2
    on('PeerDisconnected', () => { 
        removePlayer([...players][1].id)
    })
    
    // this will be Player1 as SetID happens at startup
    on('SetID',  (data: {id: string, name: string}) => {  
        console.info('players.when.SetID', data)
        const {id, name} = data
        addPlayer(id, name)
        thisPlayer.id = id
        thisPlayer.playerName = name  
        setThisPlayer(thisPlayer)
        setCurrentPlayer(thisPlayer)
        if (game) { game.resetGame() }
    })
    
    // // this can only be Player2 as Player1 is set internally above on-SetID event
    onEvent('RegisterPeer', (player: {id: string, name: string}) => {
        console.log('RegisterPeer playerid: ', player.id)
        const {id, name} = player
        if (DEBUG) console.log(`Players.RegisterPeer ${id}  ${name}`)
        addPlayer(id, name);
        setCurrentPlayer([...players][0]);
        game.resetGame();
        signal({event: 'UpdatePeers', data: Array.from(players.values())})
    })

    // will only come from focused-player (currentPeer)
    onEvent('UpdatePeers', (playersArray: Player[]) => {
        if (DEBUG) console.info('Players.UpdatePeers', playersArray)
         // clear the players set
         players.clear()

         // clear the view
         resetScoreLabels()

         // refresh the state and the view
         playersArray.forEach((newPlayer, index) => {
             players.add({
                 id: newPlayer.id,
                 idx: index,
                 playerName: newPlayer.playerName,
                 color: newPlayer.color,
                 score: 0,
                 lastScore: ""
             })

             // needed to refresh name and title
             if (thisPlayer.id === newPlayer.id) {
                 setThisPlayer(newPlayer)
             }
             updatePlayer(newPlayer.idx, newPlayer.color, newPlayer.playerName)
         })
         setCurrentPlayer([...players][0])
         game.resetGame()
     })

    //
    //  sent from server on socket.close()
    //
    onEvent('RemovePeer', (id: string) => {
         removePlayer(id)
         game.resetGame()
    })
}

/** resets all players labels */
export const resetScoreLabels = () => {
    for (let i = 0; i < MAXPLAYERS; i++) {
        updatePlayer(i, thisColor, '')
    }
}

/** reset players state to initial game state */
export const resetPlayers = () => {
    for (const player of players) {
        player.score = 0
        updatePlayer(player.idx, player.color, player.playerName)
    }
}

/** add a score value for this player */
export const addScore = (player: Player, value: number) => {
    player.score += value
    const text = (player.score === 0) ? player.playerName : `${player.playerName} = ${player.score}`
    updatePlayer(player.idx, player.color, text)
}

/** broadcast an update message to the view element */
const updatePlayer = (index: number, color: string, text: string) => {
    if (DEBUG) console.log('players.updatePlayer' + index, text)
    fire('UpdatePlayer', {index:index, color: color, text:text})
}

/** add a new player */
export const addPlayer = (id: string, playerName: string) => {
    if (DEBUG) console.log('add player ', id + '  ' + playerName)
    
    // handle any missing name with a default
    if (playerName === 'Player') {
        const num = players.size + 1
        playerName = 'Player' + num;
    }
    
    // if thisPlayer has not yet been registered
    if (thisPlayer.id === "") {
        thisPlayer.id = id
        thisPlayer.playerName = playerName
        players.add(thisPlayer)
    } 
    // go ahead and add the new player
    else {
        if (DEBUG) console.log(`Players adding, id:${id} name: ${playerName}`)
        players.add(
            {
                id: id,
                idx: players.size,
                playerName: playerName,
                color: playerColors[players.size],
                score: 0,
                lastScore: ''
            }
        )
    }
    if (DEBUG) console.info(' added player', Array.from(players.values()))

}

/**  called when the players webSocket has closed */
export const removePlayer = (id: string) => {
    const p = getById(id)
    if (DEBUG) console.info(' removing player', p)
    if(p === null) return
    players.delete(p)
    refreshPlayerColors();
    setThisPlayer([...players][0])
    setCurrentPlayer([...players][0])
}

const getById = (id: string): Player | null => {
    for (const player of players) {
        if (player.id === id) {
            return player
        }
    }
    return null
}

export const getNextPlayer = (player: Player) => {
    let next = player.idx + 1
    if (next === players.size) {
        next = 0
    }
    return [...players][next]
}

/** reassigns index and unique color for each active player */
const refreshPlayerColors = () => {
    let i = 0
    for (const player of players) {
        player.idx = i;
        player.color = playerColors[i]
        i++
    }
}


/** an array of player colors */
const playerColors = ["Brown", "Green", "RoyalBlue", "Red"]


export const setThisPlayer = (player: Player) => {
    if (DEBUG) console.info('Step-4 - Players.setThisPlayer: ', player)
    const favicon = document.getElementById("favicon") as HTMLLinkElement
    thisPlayer = player
    document.title = thisPlayer.playerName
    console.log(`./icons/${player.idx}.png`)
    favicon.href = `./icons/${player.idx}.png`;
}

export let currentPlayer: Player = {
    id: "0",
    idx: 0,
    playerName: "Player1",
    color: 'brown',
    score: 0,
    lastScore: ''
}

export const setCurrentPlayer = (player: Player) => {
    currentPlayer = player
}
