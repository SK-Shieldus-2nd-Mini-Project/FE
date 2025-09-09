import { useMemo } from "react";

export default function useFilteredGroups(groups, { region, sport, searchText }) {
    return useMemo(() => {
        return groups.filter(group => {
            const matchRegion = !region || region === '전체' || group.region === region;
            const matchSport = !sport || sport === '전체' || group.sport === sport;
            const matchText = searchText
                ? group.name.toLowerCase().includes(searchText.toLowerCase())
                : true;

            return matchRegion && matchSport && matchText;
        });
    }, [groups, region, sport, searchText]);
}