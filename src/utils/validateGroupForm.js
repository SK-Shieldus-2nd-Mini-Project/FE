export function validateGroupForm(formData) {
  if (!formData.name.trim()) return "모임 이름을 입력하세요.";
  if (!formData.description.trim()) return "모임 설명을 입력하세요.";
  if (!formData.maxMembers || formData.maxMembers <= 0) return "최대 인원을 올바르게 입력하세요.";
  if (!formData.region) return "지역을 선택하세요.";
  if (!formData.sport) return "종목을 선택하세요.";
  return null; // 에러 없으면 null 반환
}