export const formatToIST = (isoDateString) => {
    return new Date(isoDateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
  };
  