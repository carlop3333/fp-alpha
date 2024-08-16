//@ts-ignore
import page from "../dist/index.html";
import { randomUUID } from "node:crypto";

const maintenance = `<!DOCTYPE html><html><head>
  <title>ForeverPlaced - Maintenance</title>
  <link rel="icon" href="/favicon.png">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@400;700&amp;display=swap">
  <style>
    html {
        height: 100%;
        display: table;
        margin: auto;
    }
    body {
        background-color: #7166f2;
        height: 100%;
        overflow: hidden;
        width: 100%;
        text-align: center;
        align-content: center; 
        display: table-cell;
        vertical-align: middle;
    }
    .fpfont {
      font-size: 1cm;
      color: white;
      font-family: PT Sans Narrow, sans-serif;  
      font-weight: 700; 
      font-style: normal; 
    }
    .material-symbols-outlined.fix {
      color: white;
      font-size: 8cm;
    }
    @media only screen and (max-width: 400px) {
      .material-symbols-outlined.fix {
        font-size: 10cm;
      }
      .fpfont {
        font-size: 2cm;
      }
    }
  </style>
</head>
    <body>
        <span class="material-symbols-outlined fix">construction</span>
            <h1 class="fpfont">Check out status on <a style="color: #58f0c5;" href="https://discord.gg/fN4pG4AN4F" rel="noreferrer noopener" target="_blank">Discord!</a></h1>
    </body>
</html>
`;

interface Env {
  maintenance: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const maint = await ctx.env.maintenance.get("maintenance", "text");
  console.debug(maint);
  if (maint === "true") {
    const res = new Response(maintenance, {
      headers: {
        "Content-Type": "text/html",
      },
    });
    return res;
  } else {
    const res = new Response(page, {
      headers: {
        "Content-Type": "text/html",
      },
    });
    return res;
  }
};
