import express from "express"
import path from "path"
import db from "./config/connection.js"
import cors from 'cors';
// GraphQL imports
import { ApolloServer } from "@apollo/server" // Note: Import from @apollo/server-express
import { expressMiddleware } from "@apollo/server/express4"
import { typeDefs, resolvers } from "./schemas/index.js"
import { authMiddleware } from "./utils/auth.js"

if (process.env.NODE_ENV === "production") {
	console.log("Running in production mode")
} else if (process.env.NODE_ENV === "development") {
	console.log("Running in development mode")
} else {
	console.log("Unknown environment, defaulting to development")
}

const app = express()
const PORT = process.env.PORT || 3001
const isDevelopment = process.env.NODE_ENV !== "production"

// Add CORS middleware
app.use(
	cors({
		origin: "http://localhost:3000", // Allow the React app's origin to call the server
    credentials: true, // Allow credentials to be sent from the React app to the server
	})
)

const server = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: isDevelopment,
	playground: isDevelopment,
})

const startApolloServer = async () => {
	try {
		await server.start()
		await db().catch(console.dir); // connect to the database and catch any errors

		app.use(express.urlencoded({ extended: true }))
		app.use(express.json())

		app.use(
			"/graphql",
			expressMiddleware(server, {
				context: ({ req }) => authMiddleware({ req }),
			})
		)

    // Serve up static assets
    const __dirname = path.resolve()

    if (!isDevelopment) {
      app.use(express.static(path.join(__dirname, '../client/dist')));
  
      app.get('*', (_req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

		app.listen(PORT, () => {
			console.log(`🌍 Now listening on localhost:${PORT}`)
			console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
		})
	} catch (error) {
		console.error("Error starting Apollo Server:", error)
	}
}

startApolloServer()
