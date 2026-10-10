import express from 'express';
import * as aquariumController from '../controllers/aquariumController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 모든 라우트에 인증 필요
router.use(authenticateToken);

router.post('/', aquariumController.createAquarium);
router.get('/', aquariumController.getAquariums);
router.get('/:id', aquariumController.getAquariumById);
router.put('/:id', aquariumController.updateAquarium);
router.delete('/:id', aquariumController.deleteAquarium);

export default router;
