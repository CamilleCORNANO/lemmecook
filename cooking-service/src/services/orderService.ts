import { sendCommandToPlayer } from '../websocket/commandServer'

const COMMANDS = [
  { wants : "recipe", recipeId: "" },
]

// Envoyer une commande aléatoire à un joueur
export function sendRandomCommand(playerId: string) {
  const randomCommand = COMMANDS[Math.floor(Math.random() * COMMANDS.length)]
  sendCommandToPlayer(playerId, randomCommand)
}

// Lancer un système de commandes aléatoires récurrentes
export function startRandomCommandSystem(playerIds: string[], intervalMs: number = 10000) {
  console.log(` Système de commandes aléatoires démarré (${intervalMs}ms)`)
  
  setInterval(() => {
    // Choisir un joueur au hasard parmi ceux connectés
    const randomPlayer = playerIds[Math.floor(Math.random() * playerIds.length)]
    sendRandomCommand(randomPlayer)
  }, intervalMs)
}

export function startOrderGeneration(playerId: string | null, arg1: number) {
    throw new Error('Function not implemented.')
}
