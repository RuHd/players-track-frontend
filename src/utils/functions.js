import { HOST } from "@/assets/constants";

export const deleteGame = (e,gameId, setgamesList, setwasClicked) => {
    e.stopPropagation();
    setwasClicked(true);
    setTimeout(() => {
        setgamesList(prev => prev.filter((_,index) => index !== gameId))
    },1000)
}

// Refresh player count If the number changes, it will update the gameStats state
export const refreshPlayersCount = async (id, setgamesList, setUpdatedNum, setgameStats,currentPlayers) => {
    
    const res = await fetch(`${HOST}refreshPlayersCount`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*"
      },
      body: JSON.stringify({gameID : id})
    })

    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const dt = await res.json()

    if (dt.players === currentPlayers) return; // No update needed if player count hasn't changed
    
    
    setgameStats((prev) => ({...prev, players: dt.players, previous_players: currentPlayers})) // Add the new player stat and store the previous value

    setgamesList(prev => prev.map(game => game.appid == id ? {...game, players: dt.players} : game))

    setUpdatedNum(() => {
        setUpdatedNum(true)
        setTimeout(() => {
            setUpdatedNum(false)
        }, 1000)
    })
 
}

// Function to filter and sort the game list
export const filterGameList = (ev, gamesList, setgamesList) => {

    ev !== undefined && ev.preventDefault();
    const sortOption = ev.target.innerText.toLowerCase();

    switch (sortOption) {
        case 'players':
            const sortedList = [...gamesList].sort((a, b) => b.players - a.players);
            setgamesList(sortedList);
            break;
        case 'a to z':
            const sortedAZ = [...gamesList].sort((a, b) => a.name.localeCompare(b.name));
            setgamesList(sortedAZ);
            break;
        case 'z to a':
            const sortedZA = [...gamesList].sort((a, b) => b.name.localeCompare(a.name));
            setgamesList(sortedZA);
            break;
        default:
            console.warn('Unknown sort option:', sortOption);
            break;
    }
}

// Set information from game card to modal

export const openModal = (e, gameStats, setmodalStats) => {
    
    e.stopPropagation();
    setmodalStats({...gameStats, setmodalStats: setmodalStats,  mainImage: `https://steamcdn-a.akamaihd.net/steam/apps/${gameStats.appid}/library_hero.jpg`, logoImage: `https://steamcdn-a.akamaihd.net/steam/apps/${gameStats.appid}/logo.png`});
    
}

// Fetch game data from backend
export const fetchGameData = async (endpoint, method, game) => {
    debugger
    try {
        const url = `${HOST}${endpoint}`;
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: method == 'POST' ? JSON.stringify({game}) : null
        })

        if (res.status !== 200){
            return {status: res.status, data: null};
        }

        const data = await res.json()

        return {status: res.status, data: data};
    } catch (error) {
        console.error("Error fetching game data:", error);
        return {status: 500, data: null};
    }
} 

export const checkSearchCondition = (titleGame, gameList, btnClicked) => { // Return True if one of conditions is true, with purpose to disable the search
    return gameList.some(game => game.name.toLowerCase() === titleGame.toLowerCase()) || titleGame === "" || btnClicked
}

export const preventDefault = (e) => e.preventDefault()

export const calculatePorcentage = (current, previous) => {
    if(previous === 0) return "N/A"; // Avoid division by zero

    const differenceNum = current - previous
    const porcentage = (differenceNum / previous) * 100

    return porcentage.toFixed(2) + "%";
}
