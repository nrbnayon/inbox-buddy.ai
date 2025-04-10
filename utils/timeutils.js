export const formatDate = (rawDate) => {
  const date = new Date(rawDate);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Format hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12
  const formattedTime = `${hours
    .toString()
    .padStart(2, "0")}:${minutes}${ampm}`;

  // Final formatted string
  const formattedDateTime = `${monthName} ${day}, ${year} - ${formattedTime}`;

  return formattedDateTime;
};
