// const startCBT = (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "CBT started successfully"
//     });
// };

// const submitCBT = (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "CBT submitted successfully"
//     });
// };

// const getResult = (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "CBT result retrieved successfully"
//     });
// };

// const reviewCBT = (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "CBT review retrieved successfully"
//     });
// };

// module.exports = {
//     startCBT,
//     submitCBT,
//     getResult,
//     reviewCBT
// };


const {
    startExam,
    submitExam,
    getExamResult,
    reviewExam
} = require("../services/cbt.service");

const startCBT = (req, res) => {
    const result = startExam();
    res.status(200).json(result);
};

const submitCBT = (req, res) => {
    const result = submitExam();
    res.status(200).json(result);
};

const getResult = (req, res) => {
    const result = getExamResult(req.params.id);
    res.status(200).json(result);
};

const reviewCBT = (req, res) => {
    const result = reviewExam(req.params.id);
    res.status(200).json(result);
};

module.exports = {
    startCBT,
    submitCBT,
    getResult,
    reviewCBT
};