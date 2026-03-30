import React, { useState } from "react";
import "./AccountPage.css";
import { FiCalendar, FiClock, FiHeart, FiCreditCard, FiUser } from "react-icons/fi";

const AccountPage = () => {

  const [activeTab,setActiveTab] = useState("upcoming");

  return (
    <div className="account-page">

      <div className="account-header">

        <div className="account-icon">
          <FiUser/>
        </div>

        <div>
          <h2>Welcome back, John</h2>
          <p>Manage your bookings and preferences</p>
        </div>

      </div>

      <div className="account-tabs">

        <button
        className={activeTab==="upcoming" ? "tab active":"tab"}
        onClick={()=>setActiveTab("upcoming")}
        >
        <FiCalendar/> Upcoming
        </button>

        <button
        className={activeTab==="past" ? "tab active":"tab"}
        onClick={()=>setActiveTab("past")}
        >
        <FiClock/> Past Bookings
        </button>

        <button
        className={activeTab==="saved" ? "tab active":"tab"}
        onClick={()=>setActiveTab("saved")}
        >
        <FiHeart/> Saved
        </button>

        <button
        className={activeTab==="payments" ? "tab active":"tab"}
        onClick={()=>setActiveTab("payments")}
        >
        <FiCreditCard/> Payments
        </button>

        <button
        className={activeTab==="profile" ? "tab active":"tab"}
        onClick={()=>setActiveTab("profile")}
        >
        <FiUser/> Profile
        </button>

      </div>

      <div className="account-content">

        {activeTab==="upcoming" && (
          <div className="account-booking-card">
            <img src="/images/cleaning.jpg"/>
            <div>
              <h3>Deep Home Cleaning</h3>
              <p>Cleaning</p>
              <span>Tomorrow • 10:00 AM • 123 Main St</span>
            </div>

            <div className="account-status">
              Scheduled
            </div>
          </div>
        )}

        {activeTab==="past" && (
          <div className="account-booking-card">
            <img src="/images/electrical.jpg"/>
            <div>
              <h3>Electrical Wiring & Repair</h3>
              <p>⭐ 4.7</p>
              <span>Completed on March 5, 2026</span>
            </div>

            <button className="account-rebook">
              Rebook
            </button>
          </div>
        )}

        {activeTab==="saved" && (
          <div className="saved-grid">

            <div className="account-service-card">
              <img src="/images/cleaning.jpg"/>
              <h3>Deep Home Cleaning</h3>
              <p>$89</p>
              <button>View Details</button>
            </div>

            <div className="account-service-card">
              <img src="/images/plumbing.jpg"/>
              <h3>Plumbing Repair</h3>
              <p>$65</p>
              <button>View Details</button>
            </div>

          </div>
        )}

        {activeTab==="payments" && (
          <table className="account-payment-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Deep Home Cleaning</td>
                <td>Mar 1, 2026</td>
                <td>$89</td>
                <td className="account-paid">Paid</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab==="profile" && (
          <div className="account-profile-form">

            <input placeholder="Enter full name"/>
            <input placeholder="Enter email"/>
            <input placeholder="Enter phone"/>
            <input placeholder="Enter address"/>

            <button className="account-save-btn">
              Save Changes
            </button>

          </div>
        )}

      </div>

    </div>
  );
};

export default AccountPage;