export function validateGroupForm(formData) {
  if (!formData) return "폼 데이터가 없습니다.";

  const groupName = formData.groupName || "";
  const description = formData.description || "";
  const maxMembers = formData.maxMembers || "";
  const regionId = formData.regionId || "";
  const sportId = formData.sportId || "";

  if (groupName.trim() === "") return "그룹 이름을 입력해주세요.";
  if (description.trim() === "") return "모임 설명을 입력해주세요.";
  if (maxMembers === "" || Number(maxMembers) <= 0) return "최대 인원을 올바르게 입력해주세요.";
  if (regionId === "") return "지역을 선택해주세요.";
  if (sportId === "") return "종목을 선택해주세요.";

  return null; // 검증 통과
}