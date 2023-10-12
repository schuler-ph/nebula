import { Row } from "@/types/supabaseHelper";

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

export function exerciseShortDescription(exercise: Row<"exercise">) {
  let s = "";
  // s += subCategoryTranslator(exercise.subCategory) + " ";
  // s += exercise.category + " ";
  switch (exercise.subSkillCategory) {
    case "H":
      s += "Hold";
      break;
    case "T":
      s += "Transition";
      break;
    case "R":
      s += "Reps";
      break;
    default:
      s += "Basic";
      break;
  }
  s += exercise.subCategory ? " - " + exercise.subCategory : "";
  return s;
}

export function exerciseSDforSplit(exercise: Row<"exercise">) {
  let s = "";
  // s += subCategoryTranslator(exercise.subCategory) + " ";
  s += exercise.category + " ";
  switch (exercise.subSkillCategory) {
    case "H":
      s += "Hold";
      break;
    case "T":
      s += "Transition";
      break;
    case "R":
      s += "Reps";
      break;
    default:
      s += "Basic";
      break;
  }
  // s += exercise.subCategory ? " - " + exercise.subCategory : "";
  return s;
}
