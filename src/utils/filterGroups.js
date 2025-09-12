export function filterGroups(groups, { region, sport, searchText }) {
  return groups.filter(group => {
    const matchRegion = !region || region === "전체" || group.regionName === region;
    const matchSport = !sport || sport === "전체" || group.sportName === sport;
    const matchText = !searchText || group.groupName.toLowerCase().includes(searchText.toLowerCase());

    return matchRegion && matchSport && matchText;
  });
}
