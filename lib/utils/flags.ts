export const getFlagUrl = (language: string): string => {
  switch (language) {
    case "English":
      return "https://flagcdn.com/w20/gb.png";
    case "Español":
      return "https://flagcdn.com/w20/es.png";
    case "Français":
      return "https://flagcdn.com/w20/fr.png";
    case "Deutsch":
      return "https://flagcdn.com/w20/de.png";
    case "中文":
      return "https://flagcdn.com/w20/cn.png";
    case "日本語":
      return "https://flagcdn.com/w20/jp.png";
    case "Spain":
      return "https://flagcdn.com/w20/es.png";
    case "England":
      return "https://flagcdn.com/w20/gb-eng.png";
    case "Germany":
      return "https://flagcdn.com/w20/de.png";
    case "France":
      return "https://flagcdn.com/w20/fr.png";
    case "Italy":
      return "https://flagcdn.com/w20/it.png";
    case "Netherlands":
        return "https://flagcdn.com/w20/nl.png";
    case "Portugal":
        return "https://flagcdn.com/w20/pt.png";
    case "UK":
        return "https://flagcdn.com/w20/gb.png";
    case "USA":
        return "https://flagcdn.com/w20/us.png";
    case "UAE":
        return "https://flagcdn.com/w20/ae.png";
    case "Canada":
        return "https://flagcdn.com/w20/ca.png";
    case "Sweden":
        return "https://flagcdn.com/w20/se.png";
    case "Colombia":
        return "https://flagcdn.com/w20/co.png";
    case "International":
        return "https://flagcdn.com/w20/eu.png";
    default:
      return "/api/placeholder/20/15";
  }
};