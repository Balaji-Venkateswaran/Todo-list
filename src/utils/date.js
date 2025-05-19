// export const formatToIST = (isoDateString) => {
//     return new Date(isoDateString).toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata",
//       hour12: true,
//     });
//   };
  
export const formatToIST = (isoDateString) => {
  return new Date(isoDateString).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};
