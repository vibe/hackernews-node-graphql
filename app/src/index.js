const { GraphQLServer } = require('graphql-yoga');

let links = [{
	id: 'link-0',
	url: 'www.howtographql.com',
	description: 'Fullstack tutorial for GraphQL'
}];

let idCount = links.length
const resolvers = {
	Query: {
		info: () => `This is the API of a Hackernews Clone`,
		feed: () => links,
	},
	Mutation: {
		post: (root, args) => {
			const link = {
				id: `link-${idCount++}`,
				description: args.description,
				url: args.url,
			}
			links.push(link);
			return link;
		},
		updateLink: (root, args) => {
			const { id, url, description } = args;
			if (!id) {
				return null;
			}
			for(let i = 0; i < links.length; i++) {
				const workingLink = links[i];
				if(workingLink.id === id) {
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
				if(link.id === id) {
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
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
