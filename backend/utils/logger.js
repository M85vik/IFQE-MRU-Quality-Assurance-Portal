const { Logger } = require("@vikas.sharma/logflow")

const logger = new Logger({
    service:"IFQE",
    apiKey:"18d2eaf2285ef70e75215d121686bb6f7e8413a1a92409b7",
    endpoint:"https://logflow-mtzh.onrender.com"
})

module.exports= logger