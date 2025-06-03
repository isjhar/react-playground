import axios from "axios";

export async function getGroupData() {
  const response = await axios.get("/data/group.json");

  return response.data.map((group) => {
    return {
      name: group.name,
      countries: group.countries,
      displayColor: group.displayColor,
      upVotes: group.upVotes,
      riskCategory: group.riskCategory,
      timePosted: group.timePosted,
      timePostedInMinutes: timeStringToMinutes(group.timePosted),
      startDate: new Date(group.startDate),
      endDate: new Date(group.endDate),
    };
  });
}

function timeStringToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}
