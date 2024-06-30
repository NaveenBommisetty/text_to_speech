import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../SalaryCalculator/SalaryCalculator.css';


const SalaryCalculator = () => {
    const [rate, setRate] = useState(20);
    const [rateType, setRateType] = useState('per hour');
    const [currency, setCurrency] = useState('USD');
    const [hoursPerDay, setHoursPerDay] = useState(8);
    const [daysPerWeek, setDaysPerWeek] = useState(5);
    const [weeksPerYear, setWeeksPerYear] = useState(52);

    const currencyOptions = [
        { value: 'USD', label: '$ - USD' },
        { value: 'EUR', label: '€ - EUR' },
        { value: 'GBP', label: '£ - GBP' },
        { value: 'INR', label: '₹ - INR' },
        { value: 'AUD', label: 'A$ - AUD' },
        { value: 'CAD', label: 'C$ - CAD' },
        { value: 'CHF', label: 'CHF - CHF' },
        { value: 'CNY', label: '¥ - CNY' },
        { value: 'JPY', label: '¥ - JPY' },
        { value: 'NZD', label: 'NZ$ - NZD' },
        // Add more currencies as needed
    ];

    const calculateEarnings = () => {
        let hourlyRate;
        switch (rateType) {
            case 'per day':
                hourlyRate = rate / hoursPerDay;
                break;
            case 'per week':
                hourlyRate = rate / (hoursPerDay * daysPerWeek);
                break;
            case 'per month':
                hourlyRate = rate / (hoursPerDay * daysPerWeek * 4.33);
                break;
            case 'per year':
                hourlyRate = rate / (hoursPerDay * daysPerWeek * weeksPerYear);
                break;
            default:
                hourlyRate = rate;
        }

        const dailyEarnings = (hourlyRate * hoursPerDay).toFixed(2);
        const weeklyEarnings = (dailyEarnings * daysPerWeek).toFixed(2);
        const monthlyEarnings = (weeklyEarnings * 4.33).toFixed(2);
        const quarterlyEarnings = (weeklyEarnings * 13).toFixed(2);
        const yearlyEarnings = (weeklyEarnings * weeksPerYear).toFixed(2);

        return {
            hourlyEarnings: hourlyRate.toFixed(2),
            dailyEarnings,
            weeklyEarnings,
            monthlyEarnings,
            quarterlyEarnings,
            yearlyEarnings,
        };
    };

    const earnings = calculateEarnings();

    const clearFields = () => {
        setRate(0);
        setRateType('per hour');
        setCurrency('USD');
        setHoursPerDay(0);
        setDaysPerWeek(0);
        setWeeksPerYear(0);
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Earnings Report', 10, 10);
        doc.text(`Hourly Earnings: ${currency} ${earnings.hourlyEarnings}`, 10, 20);
        doc.text(`Daily Earnings: ${currency} ${earnings.dailyEarnings}`, 10, 30);
        doc.text(`Weekly Earnings: ${currency} ${earnings.weeklyEarnings}`, 10, 40);
        doc.text(`Monthly Earnings: ${currency} ${earnings.monthlyEarnings}`, 10, 50);
        doc.text(`Quarterly Earnings: ${currency} ${earnings.quarterlyEarnings}`, 10, 60);
        doc.text(`Yearly Earnings: ${currency} ${earnings.yearlyEarnings}`, 10, 70);
        doc.save('earnings_report.pdf');
    };

    const downloadCSV = () => {
        const csvContent = `data:text/csv;charset=utf-8,Hourly Earnings,Daily Earnings,Weekly Earnings,Monthly Earnings,Quarterly Earnings,Yearly Earnings\n${earnings.hourlyEarnings},${earnings.dailyEarnings},${earnings.weeklyEarnings},${earnings.monthlyEarnings},${earnings.quarterlyEarnings},${earnings.yearlyEarnings}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'earnings_report.csv');
        document.body.appendChild(link);
        link.click();
    };

    const downloadTXT = () => {
        const txtContent = `Earnings Report\nHourly Earnings: ${currency} ${earnings.hourlyEarnings}\nDaily Earnings: ${currency} ${earnings.dailyEarnings}\nWeekly Earnings: ${currency} ${earnings.weeklyEarnings}\nMonthly Earnings: ${currency} ${earnings.monthlyEarnings}\nQuarterly Earnings: ${currency} ${earnings.quarterlyEarnings}\nYearly Earnings: ${currency} ${earnings.yearlyEarnings}`;
        const element = document.createElement('a');
        const file = new Blob([txtContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'earnings_report.txt';
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="container mt-4">
            <div className="p-3 mt-2 mb-2">
                <div className="card-body">
                    <h1 className='h1-tag'>Salary to <span className='green-title-color'> Hourly Calculator</span></h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4 col-12 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="SalaryCalculator_title">Enter values</h2>
                            <div className="row">
                                <div className="col-md-6 mb-1">
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            value={rate}
                                            placeholder="Enter Value"
                                            onChange={(e) => setRate(parseFloat(e.target.value))}
                                            className="form-control"
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-12">
                                    <select
                                        value={rateType}
                                        onChange={(e) => setRateType(e.target.value)}
                                        className="form-control">
                                        <option value="per hour">per hour</option>
                                        <option value="per day">per day</option>
                                        <option value="per week">per week</option>
                                        <option value="per month">per month</option>
                                        <option value="per year">per year</option>
                                    </select>
                                </div>
                                <div className="col-md-12 col-12">
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="form-control"
                                    >
                                        {currencyOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Hours per day:</label>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <input type="number" value={hoursPerDay} onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
                                            className="form-control" min="0" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Days per week:</label>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            value={daysPerWeek}
                                            onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                                            className="form-control"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label>Weeks per year:</label>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="form-group">
                                        <input
                                            type="number"
                                            value={weeksPerYear}
                                            onChange={(e) => setWeeksPerYear(parseInt(e.target.value))}
                                            className="form-control"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row justify-content-between mt-3">
                                <button className="btn btn-secondary" onClick={clearFields}>
                                    Clear all fields
                                </button>
                                {/* <button className="btn btn-primary">Generate</button> */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8 col-12">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="SalaryCalculator_title">Your earnings</h2>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="earnings-item p-3 border rounded">
                                        <div>In an hour</div>
                                        <div className="earnings-value">{currency} {earnings.hourlyEarnings}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="earnings-item p-3 border rounded">
                                        <div>In a day</div>
                                        <div className="earnings-value">{currency} {earnings.dailyEarnings}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="earnings-item p-3 border rounded">
                                        <div>In a week</div>
                                        <div className="earnings-value">{currency} {earnings.weeklyEarnings}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="earnings-item p-3 border rounded">
                                        <div>In a month</div>
                                        <div className="earnings-value">{currency} {earnings.monthlyEarnings}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="earnings-item p-3 border rounded">
                                        <div>In a quarter</div>
                                        <div className="earnings-value">{currency} {earnings.quarterlyEarnings}</div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="earnings-item p-3 border rounded">
                                        <div>In a year</div>
                                        <div className="earnings-value">{currency} {earnings.yearlyEarnings}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <button className="btn btn-secondary">Get share link</button>
                                <div className="btn-group">
                                    <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Download as
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item" href="#" onClick={downloadPDF}>PDF</a>
                                        <a className="dropdown-item" href="#" onClick={downloadCSV}>CSV</a>
                                        <a className="dropdown-item" href="#" onClick={downloadTXT}>TXT</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryCalculator;
