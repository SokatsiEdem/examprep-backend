const startExam = () => {
    return {
        success: true,
        message: " CBT started successfully"
    };
};

const submitExam = () => {
    return {
        success: true,
        message: " CBT submitted successfully"
    };
};

const getExamResult = () => {
    return {
        success: true,
        score: 80
    };
};

const reviewExam = () => {
    return {
        success: true,
        message: "CBT review loaded successfully"
    };
};

module.exports = {
    startExam,
    submitExam,
    getExamResult,
    reviewExam
};