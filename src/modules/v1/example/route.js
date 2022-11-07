const { Router } = require("express");

const BASE_PATH = `/v1/example`;
const controller = require('./controller');

const router = Router();

router.get(`${BASE_PATH}/`, controller.getExample);
router.post(`${BASE_PATH}/`, controller.postExample);
router.put(`${BASE_PATH}/`, controller.putExample);
router.delete(`${BASE_PATH}/`, controller.deleteExample);

module.exports = router;
