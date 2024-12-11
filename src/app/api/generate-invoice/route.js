// import the necessary node libraries
import fs from "fs";
import puppeteer from "puppeteer";
import handlers from "handlebars";
import { NextResponse } from "next/server";
// import invoiceTemp from "../../../../invoice-template.html";
export const GET = () => {
  return Response.json({ data: "hello world" });
};

// export const POST = async (req, res) => {

//   const requestData = await req.json();

//   const { name } = requestData;
//   const customerName = name || "John Doe";
//   console.log("requestData", customerName);
//   //

//   try {
//     // read our invoice-template.html file using node fs module
//     // const file = fs.readFileSync("@/invoice-template.html", "utf8");
//     const file = fs.readFileSync("./invoice-template.html", "utf8");
//     console.log("file", file);
//     // compile the file with handlebars and inject the customerName variable
//     const template = handlers.compile(`${file}`);
//     const html = template({ customerName });

//     // simulate a chrome browser with puppeteer and navigate to a new page
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // set our compiled html template as the pages content
//     // then waitUntil the network is idle to make sure the content has been loaded
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     // convert the page to pdf with the .pdf() method
//     const pdf = await page.pdf({ format: "A4" });
//     await browser.close();

//     // send the result to the client
//     // res.statusCode = 200;
//     // res.send(pdf);
//     // res.status(200).json({ message: "Data received", data });
//     return Response.json({ message: "success", pdf }, { status: 200 });
//     // return Response.json({ message: "success", page }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     // res.status(500).json({ message: err.message });
//     return Response.json({ message: err.message }, { status: 500 });
//   }
// };

export const POST = async (request, res) => {
  const { name, email, total, arr } = await request.json();
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const customerName = capitalizeFirstLetter(name);
  const customerEmail = email;
  const totalAmount = total;
  try {
    const file = fs.readFileSync("./invoice-template.html", "utf8");
    const template = handlers.compile(`${file}`);
    const html = template({ customerName, customerEmail, totalAmount, arr });

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    return new NextResponse(pdf, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    NextResponse.json({ message: err.message }, { status: 500 });
    res.status(500).json({ message: err.message });
  }
};
