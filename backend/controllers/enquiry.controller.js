import Enquiry from "../models/enquiry.model.js";

const generateReferenceNumber = () => {
  return `ENQ${Date.now()}`;
};

export const createEnquiry = async (req, res) => {
  try {
    const referenceNumber = generateReferenceNumber();

    const enquiry = await Enquiry.create({
      referenceNumber,
      ...req.body,
      documents: req.files?.map(file => ({
        filename: file.originalname,
        path: file.path,
        size: file.size
      }))
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      referenceNumber: enquiry.referenceNumber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getEnquiryByReference = async (req, res) => {
  try {
    const enquiry = await Enquiry.findOne({
      referenceNumber: req.params.reference
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
