export function filterGroups(groups, { region, sport, searchText }) {
  return groups.filter(group => {
    const matchRegion = region ? group.region === region : true;
    const matchSport = sport ? group.sport === sport : true;
    const matchText = searchText
      ? group.name.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchRegion && matchSport && matchText;
  });
}