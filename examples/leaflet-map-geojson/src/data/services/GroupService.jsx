import groupData from "../group.json";

export async function getGroupData() {
  return groupData.map((group) => {
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
