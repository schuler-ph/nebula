export function capFirst(text: string) {
  text = text.charAt(0).toLocaleUpperCase() + text.substring(1, text.length);
  const regex = /(?<=\s|\(|\-)\w/g;
  return text.replace(regex, (match) => match.toLocaleUpperCase());
}

export function subCategoryTranslator(text: string | null) {
  switch (text) {
    case "H":
      return "Horizontal ";
    case "V":
      return "Vertical ";
    case null:
      return "";
  }
}

export function skillTranslator(skill: boolean) {
  if (skill) {
    return "Skill";
  } else {
    return "Basic";
  }
}
