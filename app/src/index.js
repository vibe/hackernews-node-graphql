const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: (root, args, context, info) => {
			return context.db.query.links({}, info);
		},
	},
	Mutation: {
		post: (root, args, context, info) => {
			console.log(root, args, context, info);
			return context.db.mutation.createLink({
				data: {
					url: args.url,
					description: args.description,
				},
			}, info);
		},
		updateLink: (root, args) => {
			const { id, url, description } = args;
			if (!id) {
				return null;
			}
			for (let i = 0; i < links.length; i++) {
				const workingLink = links[i];
				if (workingLink.id === id) {
					links[i] = {
						...workingLink,
						url: url || workingLink.url,
						description: description || workingLink.description,
					}
					return links[i];
				}
			}
			return null;
		},
		deleteLink: (root, args) => {
			const { id, url, description } = args;
			if (!id) {
				return null;
			}
			let deletedLink = null;
			links = links.filter(link => {
				if (link.id === id) {
					deletedLink = link;
				}
				return link.id !== id
			});
			return deletedLink;
		}
	},
	Link: {
		id: (root) => root.id,
		description: root => root.description,
		url: root => root.url,
	}
}

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: req => ({
		...req,
		db: new Prisma({
			typeDefs: 'src/generated/prisma.graphql',
			endpoint: 'http://localhost:4466/hackernews/dev',
			secret: 'awesome1337secret',
			debug: true,
		}),
	}),
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
