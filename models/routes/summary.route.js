const { getAllSummaryData, createAsummary, getASummaryDataByMonthYear, updateASummaryData } = require('../controller/summary.controller');

const router = require('express').Router();


router.get('/',getAllSummaryData);
router.post('/',createAsummary);
router.get('/:monthYear/:app',getASummaryDataByMonthYear);
router.put('/:monthYear/:app',updateASummaryData);

module.exports = router