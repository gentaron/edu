import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

/* ── Rate limiter (per IP, 10 connections / second) ───── */
const connectionAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_CONNECTIONS_PER_SEC = 10
const WINDOW_MS = 1000

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = connectionAttempts.get(ip)
  if (!entry || now > entry.resetTime) {
    connectionAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > MAX_CONNECTIONS_PER_SEC
}

/* ── Socket.IO server ─────────────────────────────────── */
const io = new Server(httpServer, {
  // DO NOT change the path, it is used by Caddy to forward the request to the correct port
  path: "/",
  cors: {
    origin: process.env.WS_ALLOWED_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

/* ── Session validation middleware ─────────────────────── */
io.use((socket, next) => {
  const clientIp = socket.handshake.address || socket.handshake.headers["x-forwarded-for"]

  // Rate limit check
  if (clientIp && isRateLimited(clientIp)) {
    return next(new Error("Rate limit exceeded"))
  }

  // Session token validation (NEXTAUTH_SESSION or custom auth token)
  const sessionToken =
    socket.handshake.auth?.token ||
    socket.handshake.headers["authorization"]?.replace("Bearer ", "")

  if (!sessionToken) {
    // Allow connection in dev mode without session (for testing)
    if (process.env.NODE_ENV === "development") {
      console.warn(`[WS] Unauthenticated connection allowed (dev mode) from ${clientIp}`)
      return next()
    }
    return next(new Error("Authentication required"))
  }

  // In production, validate the session token against NextAuth JWT
  // For now, we accept any non-empty token. Replace with proper JWT
  // verification when NextAuth session integration is implemented:
  //
  //   import { decode } from "next-auth/jwt"
  //   const session = await decode({ token: sessionToken, secret: process.env.NEXTAUTH_SECRET })
  //   if (!session) return next(new Error("Invalid session"))

  next()
})

interface User {
  id: string
  username: string
}

interface Message {
  id: string
  username: string
  content: string
  timestamp: Date
  type: "user" | "system"
}

const users = new Map<string, User>()

const generateMessageId = () => Math.random().toString(36).substr(2, 9)

const createSystemMessage = (content: string): Message => ({
  id: generateMessageId(),
  username: "System",
  content,
  timestamp: new Date(),
  type: "system",
})

const createUserMessage = (username: string, content: string): Message => ({
  id: generateMessageId(),
  username,
  content,
  timestamp: new Date(),
  type: "user",
})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Add test event handler
  socket.on("test", (data) => {
    console.log("Received test message:", data)
    socket.emit("test-response", {
      message: "Server received test message",
      data: data,
      timestamp: new Date().toISOString(),
    })
  })

  socket.on("join", (data: { username: string }) => {
    const { username } = data

    // Create user object
    const user: User = {
      id: socket.id,
      username,
    }

    // Add to user list
    users.set(socket.id, user)

    // Send join message to all users
    const joinMessage = createSystemMessage(`${username} joined the chat room`)
    io.emit("user-joined", { user, message: joinMessage })

    // Send current user list to new user
    const usersList = Array.from(users.values())
    socket.emit("users-list", { users: usersList })

    console.log(`${username} joined the chat room, current online users: ${users.size}`)
  })

  socket.on("message", (data: { content: string; username: string }) => {
    const { content, username } = data
    const user = users.get(socket.id)

    if (user && user.username === username) {
      const message = createUserMessage(username, content)
      io.emit("message", message)
      console.log(`${username}: ${content}`)
    }
  })

  socket.on("disconnect", () => {
    const user = users.get(socket.id)

    if (user) {
      // Remove from user list
      users.delete(socket.id)

      // Send leave message to all users
      const leaveMessage = createSystemMessage(`${user.username} left the chat room`)
      io.emit("user-left", {
        user: { id: socket.id, username: user.username },
        message: leaveMessage,
      })

      console.log(`${user.username} left the chat room, current online users: ${users.size}`)
    } else {
      console.log(`User disconnected: ${socket.id}`)
    }
  })

  socket.on("error", (error) => {
    console.error(`Socket error (${socket.id}):`, error)
  })
})

const PORT = 3003
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Received SIGTERM signal, shutting down server...")
  httpServer.close(() => {
    console.log("WebSocket server closed")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("Received SIGINT signal, shutting down server...")
  httpServer.close(() => {
    console.log("WebSocket server closed")
    process.exit(0)
  })
})
