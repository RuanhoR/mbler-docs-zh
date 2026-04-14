import fs from "fs/promises"
import path from "path"
import xml from "xml"
const baseURL = "https://zh-mbler-docs.ruanhor.dpdns.org/"
const exincludePath = [
  path.resolve(".vitepress/dist/404.html")
]
async function getCol(dirPath, arr = []) {
  const stat = await fs.stat(dirPath);
  if (exincludePath.includes(dirPath)) {
    return arr;
  }
  if (stat.isFile()) {
    if (dirPath.endsWith(".html")) {
      if (path.basename(dirPath) == "index.html") {
        arr.push(path.dirname(dirPath))
      } else {
        arr.push(dirPath)
      }
    }
  } else {
    await Promise.all((await fs.readdir(dirPath)).map(
      (i) => {
        return getCol(path.join(dirPath, i), arr)
      }
    ))
  }
  return arr
}
async function main() {
  const distPath = path.resolve(".vitepress/dist")
  const allURL = (await getCol(distPath, [])).map(
    (f) => {
      return baseURL + path.relative(distPath, f)
    }
  )
  const siteMapData = await Promise.all(allURL.map(
    async (i) => {
      const p = path.join(distPath, i.split(baseURL)[1])
      const f = await fs.stat(p)
      return {
        loc: i,
        changefreq: "weekly",
        priority: p.includes("guide") ? "1" : "0.7",
      }
    }
  ))
  const sitemapDataXml = siteMapData.map(i => {
    return {
      url: Object.keys(i).map(k => {
        return {
          [k]: i[k]
        }
      })
    }
  })
  const xmlData = {
    urlset: [{
        _attr: {
          xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
        },
      },
      ...sitemapDataXml
    ]
  }
  const xmlStr = xml(xmlData, {
    declaration: true
  });
  await fs.writeFile(path.join(distPath, "sitemap.xml"), xmlStr)
}
main()