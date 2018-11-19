import { Router } from 'express';

import CbfScraping from '../../scraping/CbfScraping';

const router = Router();

router.route('/load').get(async (req, res) => {
    try {
        let cbfScraping:CbfScraping = new CbfScraping;
        await cbfScraping.run();

        res.send({message:"Success"});
    } catch (error) {
        console.log(error);
        res.status(500).send({error:error+""});
    }
});

export default router;
