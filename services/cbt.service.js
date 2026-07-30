export const startExam = () => {
    return {
        success: true,
        message: " CBT started successfully"
    };
};

export const submitExam = () => {
    return {
        success: true,
        message: " CBT submitted successfully"
    };
};

export const getExamResult = () => {
    return {
        success: true,
        score: 80
    };
};

export const reviewExam = () => {
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