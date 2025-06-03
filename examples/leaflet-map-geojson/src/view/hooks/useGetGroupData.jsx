import { useEffect, useState } from "react";
import { getGroupData } from "../../data/services/GroupService";

export function useGetGroupData() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroupData().then((data) => {
      setGroups(data);
    });
  }, []);

  return groups;
}
