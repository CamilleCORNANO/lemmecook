import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import * as orderService from '../services/orderService'

const playerConnections = new Map<string, WebSocket>()

export function setupWebSocketServer(httpServer: Server) {
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  })

  console.log(' WebSocket server démarré sur /ws')

  wss.on('connection', (ws: WebSocket) => {
    console.log(' Nouvelle connexion WebSocket')
    
    let playerId: string | null = null

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString())
        
        // Authentification
        if (message.type === 'auth' && message.playerId) {
          playerId = message.playerId
          if (playerId) {
            playerConnections.set(playerId, ws)
            console.log(` Joueur ${playerId} authentifié`)
            
            ws.send(JSON.stringify({
              type: 'auth_success',
              message: 'Connecté au serveur'
            }))
            
            // Démarre la génération de commandes pour ce joueur
            orderService.startOrderGeneration(playerId, 15000)  // 15 secondes
          }
        }
        
        // Le joueur peut aussi demander manuellement une commande
        if (message.type === 'request_order' && playerId) {
          const { generateRandomOrder } = require('../services/orderService')
          generateRandomOrder(playerId)
        }
        
      } catch (error) {
        console.error('Erreur parsing message:', error)
      }
    })

    ws.on('close', () => {
      if (playerId) {
        // Arrête la génération de commandes
        const { stopOrderGeneration } = require('../services/orderService')
        stopOrderGeneration(playerId)
        playerConnections.delete(playerId)
        console.log(` Joueur ${playerId} déconnecté`)
      }
    })

    ws.on('error', (error) => {
      console.error('Erreur WebSocket:', error)
    })
  })

  return wss
}

export function sendCommandToPlayer(playerId: string, command: any) {
  const ws = playerConnections.get(playerId)
  
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'command',
      data: command
    }))
    return true
  }
  
  console.warn(` Joueur ${playerId} non connecté`)
  return false
}