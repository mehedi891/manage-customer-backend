const summaryModel = require('../models/summary.model');


const getAllSummaryData = async(req,res)=>{
    try {
        const allSummaryData = await summaryModel.find({})
        res.status(200).json(allSummaryData);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}


const createAsummary = async (req,res) =>{
    const newSummary = new summaryModel(req.body);
    try {
        res.status(201).json(newSummary);
        await newSummary.save();
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}
const updateASummaryData = async (req,res) =>{
    const monthYear = req.params.monthYear.split('-' , 2);
    const month = parseInt(monthYear[0]);
    const year = parseInt(monthYear[1]);
    const updatedSummaryData = req.body;
    console.log(updatedSummaryData);
    try {
    const result = await summaryModel.updateOne(
        {monthYear:`${month}-${year}`},
        {
            $set: updatedSummaryData
        },
        { upsert: true }
    );

    res.status(201).json({
                message: `Updated summaryData Successfully`,
                result
            })

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
  
}
const getASummaryDataByMonthYear = async (req,res) =>{
   const monthYear = req.params.monthYear.split('-' , 2);
    const month = parseInt(monthYear[0]);
    const year = parseInt(monthYear[1]);
    const filter = `${month}-${year}`
console.log(filter);
    const currDate = new Date(`${year}-${month}`);
    currDate.setMonth(currDate.getMonth());
    const monthName =  currDate.toLocaleString('default', { month: 'long' }).toLowerCase();
    console.log(monthName);

    try {

        const aSummaryData = await summaryModel.findOne({monthYear:filter});
        if (!aSummaryData){
             res.status(404).json({
                message:`Sorry No Data Found For ${monthName},${year}`,
                error: true,
            })

        }
        else{
                res.status(200).json({
                    summary:aSummaryData,
                    monthName: `${monthName},${year}`,
                });
             }
     
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }

}


module.exports = {
    getAllSummaryData,
    createAsummary,
    getASummaryDataByMonthYear,
    updateASummaryData,
}