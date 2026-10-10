
const OpenAI = require('openai');
const crypto = require('crypto');
// updated october 9th with newer api key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async function (event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        // Diagnose which API key this environment is using.
        // Never log the actual secret key.
        const apiKey = process.env.OPENAI_API_KEY;

        console.log('API key diagnostic:', {
            exists: Boolean(apiKey),
            prefix: apiKey ? apiKey.slice(0, 7) : null,
            length: apiKey ? apiKey.length : 0,
            fingerprint: apiKey
                ? crypto.createHash('sha256')
                    .update(apiKey)
                    .digest('hex')
                    .slice(0, 12)
                : null,
        });

        if (!apiKey) {
            throw new Error('OPENAI_API_KEY is missing in this environment.');
        }

        const requestBody = JSON.parse(event.body || '{}');
        const team = requestBody.team;

        if (!Array.isArray(team) || team.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'A Pokémon team is required.',
                }),
            };
        }

        const trainer = team.join(', ');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are Mewthree, a new and evolved version of Mewtwo.',
                },
                {
                    role: 'user',
                    content:
                        `Write a paragraph from your perspective describing the fight vs. ${trainer}`,
                },
            ],
            temperature: 0.8,
            max_tokens: 333,
        });

        console.log('OpenAI request succeeded:', {
            model: completion.model,
            finishReason: completion.choices[0]?.finish_reason,
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                summary: completion.choices[0],
            }),
        };
    } catch (error) {
        console.error('Mewthree function error:', {
            message: error.message,
            status: error.status,
            code: error.code,
            type: error.type,
        });

        return {
            statusCode: error.status === 401 ? 502 : 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Mewthree could not generate a battle summary.',
            }),
        };
    }
};
