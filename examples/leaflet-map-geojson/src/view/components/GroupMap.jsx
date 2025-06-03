import LeftletMap from "./LeftletMap";
import { useGetGroupData } from "../hooks/useGetGroupData";
import { useGetGeoJsonData } from "../hooks/useGetGeoJsonData";
import { useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";

export default function GroupMap() {
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [countries, setCountries] = useState([]);

  const groups = useGetGroupData();
  const countryNames = useMemo(() => getCountryNames(groups), [groups]);
  const geoJsonData = useGetGeoJsonData(countryNames);

  useEffect(() => {
    setSelectedGroup(groups);
  }, [groups]);

  useEffect(() => {
    const selectedCountries = mapGroupsToCountries(selectedGroup, geoJsonData);
    setCountries(selectedCountries);
  }, [selectedGroup, geoJsonData]);

  return (
    <div
      className="d-flex
          container
          flex-column 
          justify-content-start 
          align-items-start 
          position-relative w-100"
      style={{ gap: "10px" }}
    >
      <div
        className="d-flex flex-row justify-content-end w-100 align-items-center"
        style={{ gap: "5px" }}
      >
        <span>Select Group:</span>
        <div style={{ width: "200px" }}>
          <Form.Select
            aria-label="Default select example"
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedGroup(
                selectedValue === "All"
                  ? groups
                  : groups.filter((g) => g.name === selectedValue)
              );
            }}
          >
            <option>All</option>
            {groups.map((group, index) => {
              return (
                <option key={index} value={group.name}>
                  {group.name} ({group.countries.length})
                </option>
              );
            })}
          </Form.Select>
        </div>
      </div>
      <LeftletMap countries={countries} />
    </div>
  );
}

function getCountryNames(groups) {
  const countries = [];
  groups.forEach((group) => {
    group.countries.forEach((country) => {
      if (!countries.includes(country)) {
        countries.push(country);
      }
    });
  });
  return countries;
}

function mapGroupsToCountries(groups, geoJsonData) {
  const countries = [];
  groups.forEach((group) => {
    group.countries.forEach((country) => {
      var findCountryIndex = countries.findIndex((c) => c.name === country);
      if (findCountryIndex === -1) {
        const geoList = geoJsonData.filter(
          (g) => g.properties.name === country
        );
        let geo = null;
        if (geoList.length > 0) {
          geo = geoList[0];
        }
        countries.push({
          name: country,
          geo: geo,
          groupName: group.name,
          color: group.displayColor,
          upVotes: group.upVotes,
          riskCategory: group.riskCategory,
          timePosted: group.timePosted,
          startDate: group.startDate,
          endDate: group.endDate,
          timePostedInMinutes: group.timeStringToMinutes,
        });
        return;
      }

      if (!isMoveCountryToOtherGroup(countries[findCountryIndex], group)) {
        return;
      }

      const selectedCountry = countries[findCountryIndex];
      countries[findCountryIndex] = {
        name: selectedCountry.name,
        geo: selectedCountry.geo,
        groupName: group.name,
        color: group.displayColor,
        upVotes: group.upVotes,
        riskCategory: group.riskCategory,
        timePosted: group.timePosted,
        startDate: group.startDate,
        endDate: group.endDate,
        timePostedInMinutes: group.timeStringToMinutes,
      };
    });
  });
  return countries;
}

function isMoveCountryToOtherGroup(currentGroup, newGroup) {
  if (newGroup.upVotes != currentGroup.upVotes) {
    return newGroup.upVotes > currentGroup.upVotes;
  }
  if (newGroup.riskCategory != currentGroup.riskCategory) {
    return newGroup.riskCategory == "Threat";
  }
  if (newGroup.timePostedInMinutes != currentGroup.timePostedInMinutes) {
    return newGroup.timePostedInMinutes < currentGroup.timePostedInMinutes;
  }
  if (newGroup.startDate != currentGroup.startDate) {
    return newGroup.startDate < currentGroup.startDate;
  }
  return newGroup.endDate < currentGroup.endDate;
}
