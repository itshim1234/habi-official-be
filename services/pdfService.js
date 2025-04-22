const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const packageMap = {
  Essential: "Essential.pdf",
  Premium: "Premium.pdf",
  Luxury: "Luxury.pdf",
  EssentialPlus: "EssentialPlus.pdf",
  PremiumPlus: "PremiumPlus.pdf",
  LuxuryPlus: "LuxuryPlus.pdf",
};

const mergePdfs = async (invoiceBuffer, packageName) => {
  const mergedPdf = await PDFDocument.create();

  const invoicePdf = await PDFDocument.load(invoiceBuffer);
  const invoicePages = await mergedPdf.copyPages(
    invoicePdf,
    invoicePdf.getPageIndices()
  );
  invoicePages.forEach((page) => mergedPdf.addPage(page));

  const packagePath = path.join(__dirname, "../pdfs", packageMap[packageName]);
  const packagePdfBuffer = fs.readFileSync(packagePath);
  const packagePdf = await PDFDocument.load(packagePdfBuffer);
  const packagePages = await mergedPdf.copyPages(
    packagePdf,
    packagePdf.getPageIndices()
  );
  packagePages.forEach((page) => mergedPdf.addPage(page));

  return await mergedPdf.save();
};

module.exports = { mergePdfs };
