const PDFDocument = require("pdfkit");


function generateTableRow(doc, y, c1, c2, c3, c4, c5,c6,c7) {
  doc
    .fontSize(7)
    .text(c1, 40, y)
    .text(c2, 70, y)
    .text(c3, 180, y)
    .text(c4, 300, y)
    .text(c5, 400, y)
    .text(c6, 470, y)
    .text(c7, 0, y, { align: "right" })
    .moveTo(50, y + 15)
    .lineTo(560, y + 15)
    .lineWidth(0.5)
    .strokeColor("#ccc")
    .stroke();
}

function generateTableRowNoLine(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(7)
    .text(c1, 100, y)
    .text(c2, 100, y)
    .text(c3, 420, y, { width: 90, align: "right" })
    .text(c4, 200, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}

const generateSalesPDF = async (order, startDate, endDate) => {
    console.log(startDate,'--');
  return new Promise((resolve, reject) => {
    try {
       
    
      const doc = new PDFDocument({ margin: 50 });

      const buffers = [];
      doc.on("data", (buffer) => buffers.push(buffer));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (error) => reject(error));


      doc
        .fontSize(15)
        .text(
          `Sales Report ${
            startDate+
            " " +
            startDate
          } to ${
            endDate+ " " + endDate
          }`,
          50,
          50,
          {
            align: "center",
            width: 500,
            color: "white",
            backgroundColor: "gray",
          }
        );

      const invoiceTableTop = 100;

      generateTableRow(
        doc,
        invoiceTableTop,
        "SL No",
        "Order ID",
        "User ID",
        "Order Date",
        "Payment Method",
        
        "Amount"
      );

      let i = 0;
      let sum = 0;
      order.forEach((x) => {
        var position = invoiceTableTop + (i + 1) * 30;
        sum += x.TotalPrice;
        
     
        generateTableRow(
          doc,
          position,
          i + 1,
          x._id,
          x.UserId,
          x.OrderDate,
          x.PaymentMethod,
          x.TotalPrice 
        );
        i++;
      });

      const subtotalPosition = invoiceTableTop + order.length * 30;

      const paidToDatePosition = subtotalPosition + 30;

      const duePosition = paidToDatePosition + 30;
      generateTableRowNoLine(doc, duePosition, "", "", "Total :", "   ", sum.toFixed(2));

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateSalesPDF