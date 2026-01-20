export const success = (res, status, message, data = {}) =>
    res.status(status).json({ success: true, message, data });
  
  export const error = (res, status, message) =>
    res.status(status).json({ success: false, message });
  