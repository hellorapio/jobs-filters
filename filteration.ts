//@ts-ignore
const path = require("path");
//@ts-ignore
const { readFile, writeFile } = require("fs/promises");

class Filteration {
  static async filterJobs(jobArr: any[]) {
    let jobs = await this.filterTitles(jobArr);
    jobs = await this.filterCountries(jobs);
    jobs = await this.filterQualifications(jobs);
    jobs = await this.filterWorkTypes(jobs);

    return jobs;
  }

  static async filterTitles(jobArr: any[]) {
    return jobArr.filter((job) => {
      for (const element of this.allowedTitles) {
        if (
          job.Role.toLowerCase().includes(element) ||
          job["Job Title"].toLowerCase().includes(element)
        )
          return true;
      }
      return false;
    });
  }

  static async filterCountries(jobArr: any[]) {
    return jobArr.filter((job) => {
      if (this.allowedCountries.includes(job.Country)) return true;
      return false;
    });
  }

  static async filterQualifications(jobArr: any[]) {
    return jobArr.filter((job) => {
      if (this.unAllowedQualifications.includes(job.Qualifications))
        return false;
      return true;
    });
  }

  static async filterWorkTypes(jobArr: any[]) {
    return jobArr.filter((job) => {
      if (this.unAllowedWorkTypes.includes(job["Work Type"])) return false;
      return true;
    });
  }

  static allowedTitles = [
    "engineer",
    "developer",
    "manager",
    "customer",
    "data",
    "it",
    "help desk",
    "sales",
    "ui",
    "ux",
    "market",
    "marketing",
    "network",
    "software",
    "cloud",
  ];

  static allowedCountries = [
    "Belgium",
    "India",
    "Australia",
    "UK",
    "Saudi Arabia",
    "Mexico",
    "Germany",
    "Norway",
    "USA",
    "Netherlands",
    "France",
    "Switzerland",
    "Egypt",
    "Canada",
    "UAE",
    "Japan",
  ];

  static unAllowedQualifications = ["BA", "M.Com"];

  static unAllowedWorkTypes = ["Temporary"];
}

async function filterations() {
  const json = await readFile(path.join(__dirname, process.argv[2]), {
    encoding: "utf-8",
    flag: "r",
  });

  const data = JSON.parse(json);
  const jobs = await Filteration.filterJobs(data);

  await writeFile(
    path.join(__dirname, process.argv[3]),
    JSON.stringify(jobs, null, 2),
    {
      encoding: "utf-8",
      flag: "w",
    }
  );
}

filterations();
