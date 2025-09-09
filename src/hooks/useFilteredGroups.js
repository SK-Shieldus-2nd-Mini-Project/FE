import { useMemo } from "react";

export default function useFilteredGroups(groups, { region, sport, searchText }) {
  return useMemo(() => {
    return groups.filter(group => {
      const matchRegion = region ? group.region === region : true;
      const matchSport = sport ? group.sport === sport : true;
      const matchText = searchText
        ? group.name.toLowerCase().includes(searchText.toLowerCase())
        : true;

      return matchRegion && matchSport && matchText;
    });
  }, [groups, region, sport, searchText]);
}