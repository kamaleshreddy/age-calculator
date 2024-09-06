import React, { useState, useEffect } from 'react';

function AgeCalculator() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [ageDetails, setAgeDetails] = useState(null);
  const [nextBirthdayCountdown, setNextBirthdayCountdown] = useState(null);

  const calculateAgeDetails = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust months and days to ensure the age is accurate
    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // Days in previous month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate next birthday
    const nextBirthday = new Date(birthDate);
    nextBirthday.setFullYear(today.getFullYear());

    // If the next birthday is before today, set it to next year
    if (today > nextBirthday) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysUntilNextBirthday = Math.ceil(
      (nextBirthday - today) / (1000 * 60 * 60 * 24)
    );

    // Convert to decimal age
    const ageWithDecimal = years + months / 12 + days / 365;

    return {
      years,
      months,
      days,
      nextBirthday: nextBirthday.toISOString().split('T')[0], // Format as YYYY-MM-DD
      daysUntilNextBirthday,
      ageWithDecimal: ageWithDecimal.toFixed(2),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    if (birthDate > today) {
      alert('Date of birth cannot be in the future.');
    } else {
      const details = calculateAgeDetails(dateOfBirth);
      setAgeDetails(details);
      setNextBirthdayCountdown(details.daysUntilNextBirthday);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Function to add ordinal suffix to the day
    const getDayWithSuffix = (day) => {
      if (day >= 11 && day <= 13) {
        return day + 'th';
      }
      switch (day % 10) {
        case 1:
          return day + 'st';
        case 2:
          return day + 'nd';
        case 3:
          return day + 'rd';
        default:
          return day + 'th';
      }
    };

    return `${getDayWithSuffix(day)} ${month} ${year}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (ageDetails) {
        const today = new Date();
        const nextBirthdayDate = new Date(ageDetails.nextBirthday);
        const daysUntilNextBirthday = Math.ceil(
          (nextBirthdayDate - today) / (1000 * 60 * 60 * 24)
        );
        setNextBirthdayCountdown(daysUntilNextBirthday);
      }
    }, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(timer); // Cleanup on unmount
  }, [ageDetails]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: 'calc(100vh + 20px)',
        backgroundColor: 'Orange',
        color: 'Black',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        marginTop: '-20px',
      }}
    >
      <h1>Age Calculator</h1>
      <br />
      <form onSubmit={handleSubmit}>
        <label>
          Enter Date of Birth:
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </label>
        <br />
        <br />
        <button
          type="submit"
          style={{
            backgroundColor: 'Pink',
            color: 'Black',
            padding: '10px 20px',
            borderRadius: '5px',
          }}
        >
          Calculate Age
        </button>
      </form>

      {ageDetails && (
        <div>
          <br />
          <h2>Age Details: {ageDetails.ageWithDecimal}</h2>
          <p>{`Years: ${ageDetails.years}`}</p>
          <p>{`Months: ${ageDetails.months}`}</p>
          <p>{`Days: ${ageDetails.days}`}</p>
          <br />
          <h2>Next Birthday:</h2>
          <p>{`Your next birthday is on ${formatDate(
            ageDetails.nextBirthday
          )}`}</p>
          <p>{`Days until next birthday: ${nextBirthdayCountdown}`}</p>
        </div>
      )}
    </div>
  );
}

export default AgeCalculator;
