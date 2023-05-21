import { useEffect, useState } from "react";
import InvoicePage from "../sections/report/invoicePage";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  // Set dummy data for demonstration
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        customerName: "Ali Khan",
        address: "Peshawar",
        Currency: "Doller",
        state: "State",
        zip: "12345",
        customerNumber: "1",
        date: "2023/05/20",
        items: [
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
          { description: "Item 1", quantity: 2, unitPrice: "$10.00", total: "$20.00" },
          { description: "Item 2", quantity: 3, unitPrice: "$15.00", total: "$45.00" },
        ],
        subtotal: "$65.00",
        tax: "$6.50",
        total: "$71.50",
        dueDate: "2023-06-01",
      },
      // Add more dummy data as needed
    ];

    setInvoices(dummyData);
  }, []);

  return (
    <>
      {invoices.map((invoice) => (
        <InvoicePage key={invoice.id} invoice={invoice} />
      ))}
    </>
  );
};

export default InvoiceList;
