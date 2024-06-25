//@ts-ignore
const path = require("path");
//@ts-ignore
const { readFile, writeFile } = require("fs/promises");

async function combine() {
  const data = [];

  for (let i = 2; i <= process.argv.length - 2; i++) {
    const json = await readFile(path.join(__dirname, process.argv[i]), {
      encoding: "utf-8",
      flag: "r",
    });

    data.push(...(JSON.parse(json) as never[]));
  }

  await writeFile(
    path.join(__dirname, process.argv[process.argv.length - 1]),
    JSON.stringify(data, null, 2),
    {
      encoding: "utf-8",
      flag: "w",
    }
  );
}

combine();
