import exp from "constants";

//@ts-ignore
const path = require("path");
//@ts-ignore
const { readFile, writeFile } = require("fs/promises");

async function main() {
  const json = await readFile(path.join(__dirname, process.argv[2]), {
    encoding: "utf-8",
    flag: "r",
  });

  const data = JSON.parse(json);

  const newData = data.map((obj: any) => ({
    title: obj["Role"].trim(),
    description: obj["Job Description"],
    salary: Filtering.processSalary(obj["Salary Range"]),
    currency: Filtering.processCurrency(obj.Country),
    employmentType:
      obj["Work Type"] === "Intern"
        ? parseInt(obj.Experience.split(" to ")[0]) <= 2
          ? "internship"
          : "full-time"
        : obj["Work Type"].toLowerCase(),
    location: {
      type: "Point",
      coordinates: [obj.longitude, obj.latitude],
    },
    address: `${obj.location}, ${obj.Country}`,
    benefits: obj.Benefits.replace(/[{}']/g, "").split(", "),
    skills: Filtering.processSkills(obj.skills),
    responsibilities: obj.Responsibilities,
    minExperience: parseInt(obj.Experience.split(" to ")[0]),
    maxExperience: parseInt(obj.Experience.split(" to ")[0]) + 2,
    experienceLevel: Filtering.processExperience(
      parseInt(obj.Experience.split(" to ")[0]),
      parseInt(obj.Experience.split(" to ")[0]) + 2
    ),
    educationLevel:
      obj["Work Type"] === "Intern"
        ? "bachelor"
        : Filtering.processQualifications(obj.Qualifications),
    contactEmail: "example@example.com",
    applyUrl: "https://example.com",
  }));

  await writeFile(
    path.join(__dirname, process.argv[3]),
    JSON.stringify(newData, null, 2),
    { encoding: "utf-8", flag: "w" }
  );
}

class Filtering {
  static processQualifications(qualification: string) {
    switch (qualification) {
      case "BCA":
      case "BBA":
      case "B.Tech":
      case "B.Com":
        return "bachelor";
        break;
      case "MCA":
      case "MBA":
      case "M.Tech":
        return "master";
        break;
      case "PhD":
        return "doctorate";
        break;
      default:
        return "associate";
        break;
    }
  }

  static processSalary(salary: string) {
    const salaries = salary.split("-").map((s) => {
      return parseInt(s.replace(/\$|K/g, "")) * 1000;
    });
    return (salaries[1] + salaries[0]) / 2;
  }

  static processCurrency(country: string) {
    switch (country) {
      case "India":
        return "INR";
        break;
      case "USA":
        return "USD";
        break;
      case "UAE":
        return "AED";
        break;
      case "UK":
        return "GBP";
        break;
      case "Canada":
        return "CAD";
        break;
      case "Australia":
        return "AUD";
        break;
      case "Japan":
        return "JPY";
        break;
      case "Switzerland":
        return "CHF";
        break;
      case "Saudi Arabia":
        return "SAR";
        break;
      case "Mexico":
        return "MXN";
        break;
      case "Egypt":
        return "EGP";
        break;
      default:
        return "EUR";
        break;
    }
  }

  static processExperience(minYears: number, maxYears: number) {
    if (minYears === 0) return "internship";
    else if (minYears > 0 && maxYears <= 3) return "junior";
    else if (minYears >= 2 && maxYears <= 5) return "mid-level";
    else return "senior";
  }

  static processSkills(skillsString: string) {
    let sanitizedString = skillsString.replace(
      /[\(\),]|e\.?\s*g\.?/gi,
      ""
    );
    let skillsArray = sanitizedString.split(/ (?=[A-Z])/);
    skillsArray = skillsArray.map((skill) => skill.trim());
    return skillsArray;
  }
}

main();
