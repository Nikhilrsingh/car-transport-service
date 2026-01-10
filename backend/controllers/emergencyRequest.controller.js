import EmergencyRequest from "../models/emergencyRequest.model.js";

const generateReferenceNumber = () => {
  return `EMG${Date.now()}`;
};

export const createEmergencyRequest = async (req, res) => {
  try {
    const referenceNumber = generateReferenceNumber();

    const emergencyRequest = await EmergencyRequest.create({
      referenceNumber,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: "Emergency request submitted successfully",
      referenceNumber: emergencyRequest.referenceNumber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getEmergencyRequestByReference = async (req, res) => {
  try {
    const request = await EmergencyRequest.findOne({
      referenceNumber: req.params.reference
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Emergency request not found"
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
