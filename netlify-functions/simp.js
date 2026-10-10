const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 20000,
    maxRetries: 1,
});

exports.handler = async function (event) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Method Not Allowed',
            }),
        };
    }

    try {
        const requestBody = JSON.parse(event.body || '{}');
        const team = requestBody.team;

        if (
            !Array.isArray(team) ||
            team.length === 0 ||
            !team.every((pokemon) => typeof pokemon === 'string')
        ) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error: 'A valid Pokémon team is required.',
                }),
            };
        }

        const trainer = team.join(', ');

        console.log(`Mewthree battle request: ${trainer}`);

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

        const summary = completion.choices[0];
        const responseText = summary?.message?.content;

        // Log the generated text, even if the frontend has already timed out.
        console.log('\n--- MEWTHREE RESPONSE ---\n');
        console.log(responseText || '[No text returned]');
        console.log('\n--- END MEWTHREE RESPONSE ---\n');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ summary }),
        };
    } catch (error) {
        console.error('Mewthree API error:', {
            message: error.message,
            status: error.status,
            code: error.code,
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