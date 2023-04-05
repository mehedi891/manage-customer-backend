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
    const month = monthYear[0];
    const year = monthYear[1];
    const app = req.params.app;
     const updatedSummaryData1 = req.body;
     //console.log('month:',month);
    try {
        const isExist = await summaryModel.find({
            $and: [{app:req.params.app},{monthYear:`${month}-${year}`}]
        });
        //console.log(isExist);
    if(isExist.length > 0){
        const totalStore = req.body.incTotalStore ? isExist[0].totalStore + 1 : isExist[0].totalStore ;
        const totalCallCurrMonth = req.body.incTotalCallCurrMonth ? isExist[0].totalCallCurrMonth + 1 : isExist[0].totalCallCurrMonth;
        const totalAskRev = req.body.incTotalAskRev ? isExist[0].totalAskRev + 1 : isExist[0].totalAskRev;
        const totalReviewGive = req.body.incTotalReviewGive ? isExist[0].totalReviewGive + 1 : isExist[0].totalReviewGive;
        const uniqueCalls = req.body.incUniqueCalls ? isExist[0].uniqueCalls + 1 : isExist[0].uniqueCalls;

        const updatedSummaryData = {
            totalStore,
            totalCallCurrMonth,
            totalAskRev,
            totalReviewGive,
            uniqueCalls,
            monthYear:`${month}-${year}`,
            app,
        }
        //console.log(updatedSummaryData ,'from if');
        const result = await summaryModel.updateOne(
            {_id:isExist[0]._id},
            {
                $set: updatedSummaryData
            },
            { upsert: false }
        );
    
        res.status(201).json({
                    message: `Updated summaryData Successfully`,
                    result
                });
                
    }else{
        const totalStore = req.body.incTotalStore ?  1 : 0 ;
        const totalCallCurrMonth = req.body.incTotalCallCurrMonth ? 1 : 0 ;
        const totalAskRev = req.body.incTotalAskRev ?  1 : 0;
        const totalReviewGive = req.body.incTotalReviewGive ?  1 : 0;
        const uniqueCalls = req.body.incUniqueCalls ? 1 : 0;
        const updatedSummaryData = {
            totalStore,
            totalCallCurrMonth,
            totalAskRev,
            totalReviewGive,
            uniqueCalls,
            app,
            monthYear:`${month}-${year}`,
        }
        //console.log(updatedSummaryData ,'from else');
        const result = await summaryModel.updateOne(
            {$and: [{app:req.params.app},{monthYear:`${month}-${year}`}]},
            {
                $set: updatedSummaryData
            },
            { upsert: true }
        );
    
        res.status(201).json({
                    message: `Updated summaryData Successfully`,
                    result
                });
               
    }
 

    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
  
}
const getASummaryDataByMonthYear = async (req,res) =>{
   const monthYear = req.params.monthYear.split('-' , 2);
    const month = monthYear[0];
    const year = monthYear[1];
    const filter = `${month}-${year}`;
    const currDate = new Date(`${year}-${month}`);
    currDate.setMonth(currDate.getMonth());
    const monthName =  currDate.toLocaleString('default', { month: 'long' }).toLowerCase();
    //console.log(monthName);

    try {

       if(req.params.app !== 'total' ){
       
        const aSummaryData = await summaryModel.findOne({
            $and: [{app:req.params.app},{monthYear:filter}]
        });
        if (aSummaryData <= 0){
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


       }else{

            const findSummaryDataAllByCurrMonth = await summaryModel.aggregate([
                {$match:{monthYear: `${filter}`}},
                {$group:{_id:'$monthYear',
                totalCallCurrMonth:{$sum:'$totalCallCurrMonth'},
                totalStore:{$sum:'$totalStore'},
                totalAskRev:{$sum:'$totalAskRev'},
                totalReviewGive:{$sum: '$totalReviewGive'},
                uniqueCalls:{$sum:'$uniqueCalls'}
            }}
            ]);
            if (findSummaryDataAllByCurrMonth.length <= 0){
                res.status(404).json({
                   message:`Sorry No Data Found For ${monthName},${year}`,
                   error: true,
               })
   
           }
           else{
                   res.status(200).json({
                       summary:findSummaryDataAllByCurrMonth[0],
                       monthName: `${monthName},${year}`,
                   });
                }
   
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