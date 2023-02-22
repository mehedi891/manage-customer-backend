const clientModel = require('../models/client.model');

const getAllClient  = async (req,res)=>{
    const page = req.query.page;
    const size = req.query.size;
    console.log(page,size);
    try {
        const allClient = await clientModel.find({}).sort({_id:-1}).skip(page*size).limit(size);

    res.status(200).json(allClient);
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}
const getClientCount = async (req,res) =>{

    try {
        const clientCount = await clientModel.estimatedDocumentCount({})
        res.status(200).json(clientCount)
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }
}
const getOneClientByStoreUrlOrID = async (req,res) =>{
    const idOrStoreUrl = req.params.idOrStore.trim();
    try {
        const getOneClient = await clientModel.find({storeUrl: idOrStoreUrl});

        if(getOneClient.length <= 0){
            const getOneClientById = await clientModel.find({_id: idOrStoreUrl});
            res.status(200).send(getOneClientById[0]);
        }else{
            res.status(200).send(getOneClient[0]);
        }
    } catch (error) {
        res.status(404).json({
            message: 'Client not found',
        });
    }
}

const updateAClient = async (req,res) =>{
    const id = req.params.id;
    const updateClientData = req.body;
    console.log(id,updateClientData);
    try {
        const updatedClient = await clientModel.updateOne({_id:id},{
            $set:updateClientData,
        });
        res.status(202).json({
            message: `update client ${id}`,
            updatedClient
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
    
}

const updateAllClient = async (req,res) =>{
    
    const newUpdatedClientsData = req.body;
    try {
        const updatedClients = await clientModel.updateMany({},{
            $set:newUpdatedClientsData,
        });
        res.status(202).json({
            message: `Updated All Clients Successfully`,
            updatedClients
        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
  
}

const deleteAClient = async(req,res) =>{
    const id = req.params.id
    try {
         await clientModel.findByIdAndDelete({_id:id})
        const existsClient = await clientModel.find({})
        res.status(200).json(existsClient)
    } catch (error) {
        res.status(404).json({
            message: error.message,
        });
    }

}
const createAclient  = async (req,res)=>{
    const newClientModel = new clientModel(req.body);
    
    try {
        const existsClient = await clientModel.find({ $and: [ { storeUrl: req.body.storeUrl}, { app: req.body.app} ] });
    console.log(existsClient);
    if (existsClient.length > 0) {
        res.status(406).json({
            error: ' client is already exists'
        });
    }else{
        await newClientModel.save();
        res.status(201).json({
            message: `Successfully added ${req.body.storeUrl}`,
            existsClient
        });
    }
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
}
module.exports = {
    getAllClient,
    createAclient,
    getOneClientByStoreUrlOrID,
    updateAClient,
    updateAllClient,
    deleteAClient,
    getClientCount
}