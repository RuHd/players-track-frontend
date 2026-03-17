 const useFetchGameList = async () => {

// const url = `${HOST}${endpoint}`;
//     const res = await fetch(url, {
//         method: method,
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: method == 'POST' && body ? JSON.stringify({game}) : null
//     })

//     const data = await res.json()

//     return {status: res.status, data: data};

const response = await fetch('/games.json')
const gameData = await response.json()

return gameData

}

export default useFetchGameList
