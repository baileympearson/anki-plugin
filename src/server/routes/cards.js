/*
 * card schema
 *  id - id of card in anki database
 *  number of success
 *  number of failures
 */


module.exports = app => {
    const createCard = async card_id => {
        let card = new app.models.Card({
            card_id: card_id,
            number_successes: 0,
            number_failures: 0
        });

        await card.save();
    };

    /** 
     * gets a particular cards information
     */
    app.get('/cards/:card_id', async (req,res) => {
        const card = await app.models.Card.findOne({ 
            card_id: req.params.card_id
        });
        res.send({
            card: card
        });
    });

    /** 
     * gets all cards, sorted by failure count
     */
    app.get('/cards', async (req,res) => {
        let cards = await app.models.Card.find();

        cards = cards.sort((a,b) => b.percentage_success - a.percentage_success);
        res.send({ cards: cards } );
    });

    /** 
     * adds a new card
     *  the card information must be in the body of the request in json
     *  body {
     *      card_id: string, valid anki card id
     *  }
     */
    app.post('/cards', async (req,res) => {
        try {
            await createCard(req.body.card_id);
            res.send('card successfully added\n');
        } catch (err) {
            console.log(err);
        }
    });

    /* 
     * body {
     *  correct: true/false
     * }
     */
    app.put('/cards/:card_id/update_study_count', async (req,res) => {
        try {
            let card = await app.models.Card.findOne({
                card_id: req.params.card_id
            });

            if (!card) {
                await createCard(req.params.card_id);
                card = await app.models.Card.findOne({
                    card_id: req.params.card_id
                });
            }

            if (req.body.correct)
                card.number_successes += 1;
            else
                card.number_failures += 1;

            await card.save();

            res.sendStatus(204);
        } catch (err) {
            console.log(err);
        }
    });

    app.delete('/cards',async (req,res) => {
        await app.models.Card.deleteMany({});
        res.send('deleted all objects\n');
    });
};
