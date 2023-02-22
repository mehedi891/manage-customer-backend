const { getAllSummaryData, createAsummary, getASummaryDataByMonthYear, updateASummaryData } = require('../controller/summary.controller');

const router = require('express').Router();


router.get('/',getAllSummaryData);
router.post('/',createAsummary);
router.get('/:monthYear',getASummaryDataByMonthYear);
router.put('/:monthYear',updateASummaryData);

module.exports = router