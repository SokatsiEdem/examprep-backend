import * as cbtService from "../services/cbt.service.js";

export const startCBT = (req, res) => {
    const result = cbtService.startCBT();
    res.status(200).json(result);
};

export const submitCBT = (req, res) => {
    const result = cbtService.submitCBT();
    res.status(200).json(result);
};

export const getResult = (req, res) => {
    const result = cbtService.getResult(req.params.id);
    res.status(200).json(result);
};

export const getReview = (req, res) => {
    const result = cbtService.getReview(req.params.id);
    res.status(200).json(result);
};