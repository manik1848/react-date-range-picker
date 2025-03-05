import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    style={{
      border: "1px solid #ccc",
      borderRadius: "4px",
      padding: "6px 12px",
      width: "100%",
      boxSizing: "border-box",
    }}
    onClick={onClick}
    ref={ref}
    value={value}
    readOnly
  />
));

function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectPeriod,
  onPeriodChange,
}) {
  const [activeModal, setActiveModal] = useState(null);
  const [quickValue, setQuickValue] = useState(15);
  const [quickUnit, setQuickUnit] = useState("minutes");
  const [currentStep, setCurrentStep] = useState(null);
  const [advancedTab, setAdvancedTab] = useState("absolute");
  const [tempDate, setTempDate] = useState(new Date());
  const [manualDateInput, setManualDateInput] = useState(
    moment(new Date()).format("MMM D, YYYY @ HH:mm:ss.SSS")
  );
  const [relativeValue, setRelativeValue] = useState(1);
  const [relativeUnit, setRelativeUnit] = useState("hours");

  const formatDateWithMs = (date) => {
    if (!date) return "";
    return moment(date).format("MMM D, YYYY @ HH:mm:ss.SSS");
  };

  useEffect(() => {
    setManualDateInput(formatDateWithMs(tempDate));
  }, [tempDate]);

  // Toggle Quick Select modal
  const openQuickModal = () => {
    if (activeModal === "quick") setActiveModal(null);
    else setActiveModal("quick");
  };

  // Open Advanced modal in "start" step
  const openAdvancedModal = () => {
    setActiveModal("advanced");
    setCurrentStep("start");
    setAdvancedTab("absolute");
    setTempDate(startDate || new Date());
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentStep(null);
    setAdvancedTab("absolute");
  };

  // =======================
  //   QUICK MODAL
  // =======================
  const renderQuickModal = () => {
    if (activeModal !== "quick") return null;

    const applyQuickRange = () => {
      const now = moment();
      const newStart = now.clone().subtract(quickValue, quickUnit);
      onStartDateChange(newStart.toDate());
      onEndDateChange(now.toDate());
      closeModal();
    };

    const commonRanges = [
      { label: "Today", start: moment().startOf("day"), end: moment() },
      { label: "This week", start: moment().startOf("week"), end: moment() },
      {
        label: "Last 15 minutes",
        start: moment().subtract(15, "minutes"),
        end: moment(),
      },
      {
        label: "Last 30 minutes",
        start: moment().subtract(30, "minutes"),
        end: moment(),
      },
      {
        label: "Last 1 hour",
        start: moment().subtract(1, "hours"),
        end: moment(),
      },
      {
        label: "Last 24 hours",
        start: moment().subtract(24, "hours"),
        end: moment(),
      },
      {
        label: "Last 7 days",
        start: moment().subtract(7, "days"),
        end: moment(),
      },
      {
        label: "Last 30 days",
        start: moment().subtract(30, "days"),
        end: moment(),
      },
      {
        label: "Last 90 days",
        start: moment().subtract(90, "days"),
        end: moment(),
      },
      {
        label: "Last 1 year",
        start: moment().subtract(1, "years"),
        end: moment(),
      },
    ];

    const half = Math.ceil(commonRanges.length / 2);
    const leftCol = commonRanges.slice(0, half);
    const rightCol = commonRanges.slice(half);

    return (
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 8,
          width: 400,
          padding: 16,
          zIndex: 999,
        }}
      >
        <p
          style={{
            marginTop: 5,
            marginBottom: 15,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Quick Select
        </p>

        {/* "Last X [unit]" row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span>Last</span>
          <input
            type="number"
            value={quickValue}
            onChange={(e) => setQuickValue(e.target.value)}
            style={{
              width: 60,
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "4px",
            }}
          />
          <select
            value={quickUnit}
            onChange={(e) => setQuickUnit(e.target.value)}
            style={{
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "4px",
            }}
          >
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
            <option value="years">years</option>
          </select>
          <button
            onClick={applyQuickRange}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Apply
          </button>
        </div>

        <h5 style={{ margin: "15px 0 0", fontWeight: 600, fontSize: 14 }}>
          Commonly used
        </h5>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            {leftCol.map((item) => (
              <p
                key={item.label}
                onClick={() => {
                  onStartDateChange(item.start.toDate());
                  onEndDateChange(item.end.toDate());
                  closeModal();
                }}
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  marginBottom: 6,
                }}
              >
                {item.label}
              </p>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {rightCol.map((item) => (
              <p
                key={item.label}
                onClick={() => {
                  onStartDateChange(item.start.toDate());
                  onEndDateChange(item.end.toDate());
                  closeModal();
                }}
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  marginBottom: 6,
                }}
              >
                {item.label}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // =======================
  //   ADVANCED MODAL
  // =======================
  const renderAdvancedModal = () => {
    if (activeModal !== "advanced") return null;

    const modalTitle =
      currentStep === "start" ? "Select Start Date" : "Select End Date";

    const handleNextOrApply = () => {
      if (currentStep === "start") {
        onStartDateChange(tempDate);
        setCurrentStep("end");
        setAdvancedTab("absolute");
        setTempDate(endDate || new Date());
      } else {
        onEndDateChange(tempDate);
        closeModal();
      }
    };

    const handleCancel = () => {
      closeModal();
    };

    // Absolute tab
    const renderAbsoluteTab = () => (
      <div style={{ marginBottom: 16 }}>
        <DatePicker
          selected={tempDate}
          onChange={(date) => setTempDate(date)}
          showTimeSelect
          timeFormat="HH:mm:ss"
          dateFormat="MMMM d, yyyy HH:mm:ss"
          inline
          customInput={<CustomInput />}
        />
      </div>
    );

    // Relative tab
    const renderRelativeTab = () => {
      const applyRelative = () => {
        const now = moment();
        const newDate = now.subtract(relativeValue, relativeUnit).toDate();
        setTempDate(newDate);
      };

      return (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              type="number"
              value={relativeValue}
              onChange={(e) => setRelativeValue(e.target.value)}
              style={{
                width: 80,
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "4px",
              }}
            />
            <select
              value={relativeUnit}
              onChange={(e) => setRelativeUnit(e.target.value)}
              style={{
                border: "1px solid #ccc",
                borderRadius: 4,
                padding: "4px",
              }}
            >
              <option value="seconds">seconds</option>
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
              <option value="weeks">weeks</option>
              <option value="months">months</option>
              <option value="years">years</option>
            </select>
            <button
              onClick={applyRelative}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          </div>
        </div>
      );
    };

    // Now tab
    const renderNowTab = () => (
      <div style={{ marginBottom: 16 }}>
        <p>
          Setting the time to <strong>"now"</strong> means that on every
          refresh, this time will be set to the current time.
        </p>
        <button
          onClick={() => setTempDate(new Date())}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            width: "100%",
            margin: "auto",
            marginTop: 10,
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Set {currentStep} date and time to now
        </button>
      </div>
    );

    // Manual editing input (only shown in Absolute tab)
    const renderManualInput = () => (
      <div style={{ display: "flex", marginBottom: 16 }}>
        {/* Left label box */}
        <div
          style={{
            backgroundColor: "#f0f0f0",
            padding: "8px",
            border: "1px solid #ccc",
            borderRight: "none",
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            minWidth: "80px",
            textAlign: "center",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {currentStep === "start" ? "Start Date" : "End Date"}
        </div>

        {/* Right input box */}
        <input
          style={{
            backgroundColor: "#fff",
            padding: "8px",
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4,
            border: "1px solid #ccc",
            borderLeft: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
          value={manualDateInput}
          onChange={(e) => setManualDateInput(e.target.value)}
          onBlur={(e) => {
            const parsed = moment(
              e.target.value,
              "MMM D, YYYY @ HH:mm:ss.SSS",
              true
            );
            if (parsed.isValid()) {
              setTempDate(parsed.toDate());
            } else {
              // revert to existing date if invalid
              setManualDateInput(formatDateWithMs(tempDate));
            }
          }}
        />
      </div>
    );

    return (
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 8,
          width: 450,
          padding: 16,
          zIndex: 999,
        }}
      >
        <h3 style={{ marginTop: 5, marginBottom: 16, fontWeight: 500 }}>
          {modalTitle}
        </h3>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: 16 }}>
          {["absolute", "relative", "now"].map((tab) => (
            <div
              key={tab}
              style={{
                flex: 1,
                textAlign: "center",
                paddingBottom: 8,
                fontWeight: "bold",
                cursor: "pointer",
                borderBottom:
                  advancedTab === tab ? "3px solid #007bff" : "1px solid grey",
                color: advancedTab === tab ? "#007bff" : "#333",
              }}
              onClick={() => setAdvancedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        {/* Tab content */}
        {advancedTab === "absolute" && (
          <>
            {renderAbsoluteTab()}
            {renderManualInput()}
          </>
        )}
        {advancedTab === "relative" && renderRelativeTab()}
        {advancedTab === "now" && renderNowTab()}

        {/* Footer buttons */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleNextOrApply}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {currentStep === "start" ? "Next" : "Apply"}
          </button>
        </div>
      </div>
    );
  };

  /**
   * Display logic:
   * - If no dates: "Start Date → End Date" (gray placeholder)
   * - If only start: "Feb 20, 2025 ... → End Date" (with smaller font)
   * - If both: "Feb 20, 2025 ... → Feb 20, 2025 ..." (smaller font)
   */
  const displayValue = () => {
    const styleDates = { fontSize: 12 }; // smaller font for chosen dates
    const stylePlaceholder = {
      fontSize: 12,
      color: "grey",
      width: "100%", // full width
      display: "inline-block", // so it can stretch
    };

    if (!startDate && !endDate) {
      return <span style={stylePlaceholder}>Start Date → End Date</span>;
    }
    if (startDate && !endDate) {
      return (
        <span style={styleDates}>
          {formatDateWithMs(startDate)} →{" "}
          <span style={{ color: "grey", fontWeight: 500 }}>End Date</span>
        </span>
      );
    }
    // Both dates chosen
    return (
      <span style={styleDates}>
        {formatDateWithMs(startDate)} → {formatDateWithMs(endDate)}
      </span>
    );
  };

  return (
    <div style={{ position: "relative", margin: 10 }}>
      {/* Outer container with a single border */}
      <div
        style={{
          display: "flex",
          width: 430,
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      >
        {/* Left side: gray background with calendar icon + arrow (quick modal) */}
        <div
          style={{
            backgroundColor: "#f0f0f0",
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            padding: "0 4px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={openQuickModal}
        >
          <CalendarMonthOutlinedIcon
            style={{ color: "#0096FF", marginRight: 1 }}
            fontSize={"small"}
          />
          <KeyboardArrowDownOutlinedIcon
            style={{ color: "#0096FF" }}
            fontSize={"small"}
          />
        </div>

        {/* Right side: date range text (advanced modal) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            cursor: "pointer",
          }}
          onClick={openAdvancedModal}
        >
          {displayValue()}
        </div>
      </div>

      {/* Quick Select Modal */}
      {renderQuickModal()}

      {/* Advanced Modal */}
      {renderAdvancedModal()}
    </div>
  );
}

export default DateRangePicker;
