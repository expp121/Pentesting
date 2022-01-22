const bot = require('../bot');
const fs = require('fs');

let db;

async function router (fastify, options) {
	fastify.get('/', async (request, reply) => {
		return reply.type('text/html').send(fs.readFileSync('views/index.html',{encoding:'utf8', flag:'r'}));
	});


	fastify.get('/feedback', async (request, reply) => {
		return reply.type('text/html').send(fs.readFileSync('views/feedback.html',{encoding:'utf8', flag:'r'}));
	});

	fastify.post('/api/submit', async (request, reply) => {
		let { feedback } = request.body;
		
		if (feedback) {
			return db.addFeedback(feedback)
				.then(() => {
					bot.purgeData(db);
					reply.send({ message: 'Our intern has worked tirelessly to process your feedback.' });
				})
				.catch(() => reply.send({ message: 'Ooops, couldn\'t process your feedback.', error: 1}));
		}

		return reply.send({ message: 'Missing parameters.', error: 1 });
	});

	fastify.get('/list', async (request, reply) => {
		if (request.ip != '127.0.0.1') {
			return reply.code(401).send({ message: 'Only localhost is allowed'});
		}
		return await db.getFeedback()
			.then(feedback => {
				if (feedback) {
					return reply.view('views/list.pug', { feedback: feedback });
				}
				return reply.send({ message: 'No feedback recieved yet.' });
			})
			.catch(() => {
				return reply.send({ message: 'Ooops, something wen\'t wrong while retrieving feedback.' });
			});
	});

	fastify.get('/flag', async (request, reply) => {
		if (request.ip != '127.0.0.1') {
			return reply.code(401).send({ message: 'Only localhost is allowed'});
		}
		return reply.send({ message: 'flag_you_w0uldnt_copy_paste_content_Would_u?'});
	});
}

module.exports = database => {
	db = database;
	return router;
};