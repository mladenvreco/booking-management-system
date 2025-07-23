import React from "react";

const ExportCSV = ({ data, fileName }) => {
  const downloadCSV = () => {
    // Convert the data array into a CSV string
    const csvString = [
      ["Header1", "Header2", "Header3"], // Specify your headers here
      ...data.map((item) => [item.field1, item.field2, item.field3]), // Map your data fields accordingly
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv" });

    // Generate a download link and initiate the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "download.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return <button onClick={downloadCSV}>Export CSV</button>;
};

export default ExportCSV;
