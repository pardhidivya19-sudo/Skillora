import { useEffect, useState } from "react";
import API from "../../services/api";
import "./VendorInvoices.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FileText, Download } from "lucide-react";

function VendorInvoices() {
  const [data, setData] = useState([]);

  const downloadInvoice = async (item) => {
    const element = document.getElementById(`invoice-${item.booking_id}`);

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 180, 0);

    pdf.save(`invoice_${item.booking_id}.pdf`);
  };

  useEffect(() => {
    API.get("/provider/invoices")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="invoice-container">

      {/* ✅ NEW HEADER */}
      <h2 className="inv-title">Invoices</h2>
      <p className="inv-subtitle">Manage and download invoices</p>

      {data.length === 0 ? (
        <p>No invoices found</p>
      ) : (
        <div className="invoice-list">

          {data.map((item) => (

            <div key={item.booking_id} className="invoice-card">

              {/* 🔥 HIDDEN TEMPLATE (UNCHANGED) */}
              <div
                id={`invoice-${item.booking_id}`}
                className="invoice-template"
              >
                <h2>Skillora</h2>
                <p>Service Marketplace</p>

                <hr />

                <p><b>Invoice ID:</b> #{item.booking_id}</p>
                <p><b>Date:</b> {item.booking_date}</p>

                <p><b>Customer:</b> {item.user_name}</p>
                <p><b>Service:</b> {item.skill_name}</p>

                <hr />

                <p><b>Amount:</b> ₹{item.total_amount}</p>

                <p>GST (18%): ₹{(item.total_amount * 0.18).toFixed(2)}</p>

                <h3>
                  Total: ₹{(item.total_amount * 1.18).toFixed(2)}
                </h3>

                <hr />

                <p>Thank you for using Skillora ❤️</p>
              </div>

              {/* ✅ NEW UI CARD */}
              <div className="inv-top">

                <div className="inv-left">
                  <div className="inv-icon">
  <FileText size={18} />
</div>

                  <div>
                    <p className="inv-id">INV-{item.booking_id}</p>
                    <h3>{item.skill_name}</h3>
                  </div>
                </div>

                <span className="status paid">paid</span>

              </div>

              <div className="inv-details">

                <div className="row">
                  <span>Customer</span>
                  <span>{item.user_name}</span>
                </div>

                <div className="row">
                  <span>Amount</span>
                  <span>₹{item.total_amount}</span>
                </div>

                <div className="row">
                  <span>Date</span>
                  <span>
  {new Date(item.booking_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })}
</span>
                </div>

              </div>

              <button
                className="download-btn"
                onClick={() => downloadInvoice(item)}
              >
                 <Download size={16} style={{ marginRight: "6px" }} />
Download Invoice
              </button>

            </div>

          ))}

        </div>
      )}
    </div>
  );
}

export default VendorInvoices;